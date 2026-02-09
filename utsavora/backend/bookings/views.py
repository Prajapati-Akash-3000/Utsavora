from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVerifiedUser, IsActiveManager
from accounts.models import User, ManagerAvailability
from events.models import Event
from .models import Booking
from .serializers import BookingSerializer
from packages.models import Package
from django.db import transaction
from django.utils import timezone
from datetime import date, timedelta
from django.shortcuts import get_object_or_404

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    user = request.user
    event_id = request.data.get("event_id")
    package_id = request.data.get("package_id")

    event = get_object_or_404(Event, id=event_id, created_by=user)
    package = get_object_or_404(Package, id=package_id)
    manager = package.manager.user # package.manager is a ManagerProfile

    # 🔒 Availability check (Explicit Blocked Dates - New Model)
    # Check if manager has explicitly blocked this date
    # No need to check managerprofile anymore, we use User directly for ManagerAvailability
    if ManagerAvailability.objects.filter(
        manager=manager,
        date=event.event_date
    ).exists():
        return Response(
            {"error": "Manager not available on this date"},
            status=400
        )
             
    # Check if already booked (CONFIRMED or ACCEPTED?)
    # For now, let's assume CONFIRMED blocks it. ACCEPTED also blocks it via ManagerBlockedDate.
    booking = Booking.objects.create(
        user=user,
        event=event,
        package=package,
        manager=manager,
        status="PENDING" 
    )
    
    # 🔄 Event Status -> PENDING
    event.status = "PENDING"
    event.save(update_fields=["status"])

    return Response(
        {"message": "Booking request sent", "booking_id": booking.id},
        status=201
    )

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def request_booking(request):
    event_id = request.data.get("event_id")
    manager_id = request.data.get("manager_id")

    if not event_id or not manager_id:
        return Response({"error": "Missing event_id or manager_id"}, status=400)

    try:
        event = Event.objects.get(id=event_id, created_by=request.user)
    except Event.DoesNotExist:
        return Response({"error": "Event not found or does not belong to you"}, status=404)
        
    try:
        manager = User.objects.get(id=manager_id, role="MANAGER", manager_status="ACTIVE")
    except User.DoesNotExist:
        return Response({"error": "Manager not found or not active"}, status=404)

    # 🔒 Availability check (Explicit Blocked Dates - New Model)
    # Check if manager has explicitly blocked this date
    if ManagerAvailability.objects.filter(
        manager=manager,
        date=event.event_date
    ).exists():
        return Response(
            {"detail": "Manager is not available on the selected date."},
            status=400
        )
             
    booking = Booking.objects.create(
        event=event,
        user=request.user,
        manager=manager,
        status="PENDING" 
    )

    # 🔄 Event Status -> PENDING
    event.status = "PENDING"
    event.save(update_fields=["status"])

    # Send Email (Defensive Wrap)
    try:
        email_manager_request(manager, event)
    except Exception as e:
        print(f"⚠️ Email Error (Manager Request): {e}")

    return Response({"message": "Booking request sent", "booking_id": booking.id})


from events.services.email_service import email_manager_request, email_manager_accepted

@api_view(["POST"])
@permission_classes([IsActiveManager])
def accept_booking(request, booking_id):
    try:
        booking = get_object_or_404(
            Booking,
            id=booking_id,
            manager=request.user
        )

        # 🔒 STATUS VALIDATION
        if booking.status != "PENDING":
            return Response(
                {"error": f"Cannot accept booking in '{booking.status}' state"},
                status=400
            )

        event = booking.event
        # Handle nullable start/end if legacy event_date is used (fallback)
        start = event.start_date or event.event_date
        end = event.end_date or event.event_date

        if not start or not end:
             return Response(
                {"error": "Event dates are invalid (None)"},
                status=400
            )

        # 🔒 Conflict Check: Check if ANY date in range is explicitly blocked/booked
        conflicts = ManagerAvailability.objects.filter(
            manager=request.user,
            date__range=(start, end)
        )

        if conflicts.exists():
            # Check if it is THIS booking? If so, we might be re-accepting (but status check handles that)
            # Or maybe we have a lingering block?
            # For now, strict block.
            return Response(
                {"error": "One or more dates in this range are already unavailable."},
                status=400
            )

        # 🔥 Atomic Operation
        with transaction.atomic():
            booking.status = "ACCEPTED"
            booking.accepted_at = timezone.now()
            booking.save()
            
            # 🔄 Event Status -> ACTIVE (Manager Hired)
            event.status = "ACTIVE"
            event.save(update_fields=["status"])
            
            # Send Email (Defensive Wrap)
            try:
                email_manager_accepted(booking.user, event)
            except Exception as e:
                print(f"⚠️ Email Error (Manager Acceptance): {e}")

            # Create/Lock dates
            # Iterate from start to end
            curr = start
            while curr <= end:
                # Use get_or_create to be safe against race/duplicates
                ManagerAvailability.objects.get_or_create(
                    manager=request.user,
                    date=curr,
                    defaults={
                        "status": "BOOKED",
                        "booking": booking
                    }
                )
                curr += timedelta(days=1)

        return Response(
            {"message": "Booking accepted and dates locked successfully."},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        import traceback
        print("❌ ACCEPT BOOKING ERROR ❌")
        print(traceback.format_exc())
        return Response(
            {"error": str(e)},
            status=500
        )


@api_view(["POST"])
@permission_classes([IsActiveManager])
def reject_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, manager=request.user)

    if booking.status != "PENDING":
        return Response(
            {"error": f"Cannot reject booking in '{booking.status}' state"},
            status=400
        )

    booking.status = "REJECTED"
    booking.save()

    return Response(
        {"message": "Booking rejected."},
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsVerifiedUser])
def list_user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsActiveManager])
def list_manager_requests(request):
    # Fetch all bookings for the logged-in manager (not just pending)
    bookings = Booking.objects.filter(manager=request.user).order_by("-created_at")
    
    data = []
    for b in bookings:
        data.append({
            "id": b.id,
            "event": b.event.title,
            "user_name": b.user.full_name,
            "price": b.package.price if b.package else "N/A",
            "date": b.event.event_date,
            "status": b.status
        })
    return Response(data)

@api_view(["GET"])
@permission_classes([IsActiveManager])
def booking_conflicts(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, manager=request.user)
    event = booking.event
    
    # Handle nullable dates
    start = event.start_date or event.event_date
    end = event.end_date or event.event_date
    
    if not start or not end:
         return Response({"has_conflict": False, "reason": "No dates set"})

    conflicts = ManagerAvailability.objects.filter(
        manager=request.user,
        date__range=(start, end)
    )

    return Response({
        "has_conflict": conflicts.exists(),
        "conflict_dates": [c.date for c in conflicts]
    })
