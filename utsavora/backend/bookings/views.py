from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVerifiedUser, IsActiveManager
from accounts.models import User
from accounts.models import ManagerProfile, ManagerAvailability
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
    manager = package.manager

    start = event.start_date
    end = event.end_date or event.start_date

    # 🔒 Availability check
    if ManagerAvailability.objects.filter(
        manager=manager,
        date__range=(start, end),
        status="BLOCKED"
    ).exists():
        return Response(
            {"error": "Manager has blocked out one or more dates for this event."},
            status=400
        )
        
    # 🔒 Conflict Check
    from bookings.models import Booking as BK
    paid_conflicts = BK.objects.filter(
        manager=manager,
        status="CONFIRMED",
        payment_status="FULLY_PAID",
        event__start_date__lte=end,
        event__end_date__gte=start
    )
    if paid_conflicts.exists():
        return Response(
            {"error": "Manager is already booked for these dates."},
            status=400
        )

    # 🛑 Prevent hiring for started or completed events
    today = timezone.now().date()
    if event.status in [Event.Status.COMPLETED, Event.Status.CANCELLED]:
        return Response({"error": f"Event is {event.status.lower()} and cannot be managed."}, status=400)
    
    event_date = event.start_date
    if event_date and today >= event_date:
        return Response({"error": "Event has already started or is today. You cannot hire a manager now."}, status=400)
    
    # Check if already booked
    active_booking = Booking.objects.filter(
        event=event,
        manager=manager,
        status__in=["PENDING", "ACCEPTED", "CONFIRMED"]
    ).first()
    
    if active_booking:
        return Response(
            {"error": f"You already have an active booking request with this manager (status: {active_booking.status})."},
            status=400
        )
    
    booking = Booking.objects.create(
        user=user,
        event=event,
        package=package,
        manager=manager,
        status="PENDING",
        total_amount=package.price if package else 0
    )
    
    event.status = Event.Status.CREATED
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
        manager = ManagerProfile.objects.get(id=manager_id, manager_status="ACTIVE")
    except ManagerProfile.DoesNotExist:
        return Response({"error": "Manager not found or not active"}, status=404)

    start = event.start_date
    end = event.end_date or event.start_date

    # 🔒 Availability check
    if ManagerAvailability.objects.filter(
        manager=manager,
        date__range=(start, end),
        status="BLOCKED"
    ).exists():
        return Response(
            {"detail": "Manager has blocked out one or more dates for this event."},
            status=400
        )
        
    # 🔒 Conflict Check
    from bookings.models import Booking as BK
    paid_conflicts = BK.objects.filter(
        manager=manager,
        status="CONFIRMED",
        payment_status="FULLY_PAID",
        event__start_date__lte=end,
        event__end_date__gte=start
    )
    if paid_conflicts.exists():
        return Response(
            {"detail": "Manager is already booked for these dates."},
            status=400
        )

    # 🛑 Prevent hiring for started or completed events
    today = timezone.now().date()
    if event.status in [Event.Status.COMPLETED, Event.Status.CANCELLED]:
        return Response({"error": f"Event is {event.status.lower()} and cannot be managed."}, status=400)
    
    event_date = event.start_date
    if event_date and today >= event_date:
        return Response({"error": "Event has already started or is today. You cannot hire a manager now."}, status=400)
             
    booking = Booking.objects.create(
        event=event,
        user=request.user,
        manager=manager,
        status="PENDING" 
    )

    event.status = Event.Status.CREATED
    event.save(update_fields=["status"])

    return Response({"message": "Booking request sent", "booking_id": booking.id})

@api_view(["POST"])
@permission_classes([IsActiveManager])
def accept_booking(request, booking_id):
    try:
        manager = request.user.manager_profile
        booking = get_object_or_404(
            Booking,
            id=booking_id,
            manager=manager
        )

        if booking.status != "PENDING":
            return Response(
                {"error": f"Cannot accept booking in '{booking.status}' state"},
                status=400
            )

        event = booking.event
        start = event.start_date
        end = event.end_date or event.start_date

        if not start or not end:
             return Response({"error": "Event dates are invalid"}, status=400)

        # 🔒 Conflict Check
        from bookings.models import Booking as BK
        paid_conflicts = BK.objects.filter(
            manager=manager,
            status="CONFIRMED",
            payment_status="FULLY_PAID",
            event__start_date__lte=end,
            event__end_date__gte=start
        ).exclude(id=booking.id)

        manual_blocks = ManagerAvailability.objects.filter(
            manager=manager,
            date__range=(start, end),
            status="BLOCKED"
        )

        if paid_conflicts.exists() or manual_blocks.exists():
            return Response(
                {"error": "One or more dates in this range are already unavailable."},
                status=400
            )

        with transaction.atomic():
            booking.status = "ACCEPTED"
            booking.accepted_at = timezone.now()
            booking.save()
            
            event.status = Event.Status.CONFIRMED
            event.save(update_fields=["status"])

        return Response({"message": "Booking accepted. Awaiting user payment to confirm."}, status=200)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([IsActiveManager])
def reject_booking(request, booking_id):
    manager = request.user.manager_profile
    booking = get_object_or_404(Booking, id=booking_id, manager=manager)

    if booking.status != "PENDING":
        return Response({"error": f"Cannot reject booking in '{booking.status}' state"}, status=400)

    with transaction.atomic():
        booking.status = "REJECTED"
        booking.save()

        event = booking.event
        event.status = Event.Status.CREATED
        event.save(update_fields=["status"])

    return Response({"message": "Booking rejected."}, status=200)

@api_view(["GET"])
@permission_classes([IsVerifiedUser])
def list_user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).select_related(
        'event', 'event__category', 'package', 'manager'
    ).order_by("-created_at")
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsActiveManager])
def list_manager_requests(request):
    manager = request.user.manager_profile
    bookings = Booking.objects.filter(manager=manager).select_related(
        'event', 'event__category', 'user', 'package'
    ).order_by("-created_at")
    
    data = []
    for b in bookings:
        data.append({
            "id": b.id,
            "event": b.event.title,
            "event_id": b.event.id,
            "event_category": (b.event.category.name if getattr(b.event, "category", None) else None),
            "user_name": b.user.full_name or b.user.email,
            "user_email": b.user.email,
            "user_mobile": b.user.mobile,
            "package_name": b.package.title if b.package else "Custom",
            "price": b.total_amount,
            "start_date": b.event.start_date,
            "end_date": b.event.end_date,
            "venue": b.event.venue,
            "city": b.event.city,
            "status": b.status
        })
    return Response(data)

@api_view(["GET"])
@permission_classes([IsActiveManager])
def booking_conflicts(request, booking_id):
    manager = request.user.manager_profile
    booking = get_object_or_404(Booking, id=booking_id, manager=manager)
    
    start = booking.event.start_date
    end = booking.event.end_date or booking.event.start_date
    
    conflicts = Booking.objects.filter(
        manager=manager,
        status="CONFIRMED",
        event__start_date__lte=end,
        event__end_date__gte=start
    ).exclude(id=booking.id)
    
    data = BookingSerializer(conflicts, many=True).data
    return Response(data)
