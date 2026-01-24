from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVerifiedUser, IsActiveManager
from accounts.models import User
from events.models import Event
from .models import Booking
from manager.models import ManagerBlockedDate
from django.db import transaction
from django.utils import timezone

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def request_booking(request):
    event_id = request.data.get("event_id")
    manager_id = request.data.get("manager_id")

    if not event_id or not manager_id:
        return Response({"error": "Missing event_id or manager_id"}, status=400)

    try:
        event = Event.objects.get(id=event_id, user=request.user)
    except Event.DoesNotExist:
        return Response({"error": "Event not found or does not belong to you"}, status=404)
        
    try:
        manager = User.objects.get(id=manager_id, role="MANAGER", manager_status="ACTIVE")
    except User.DoesNotExist:
        return Response({"error": "Manager not found or not active"}, status=404)

    # 🔒 Availability check (Explicit Blocked Dates - New Model)
    # Check if manager has explicitly blocked this date
    if hasattr(manager, 'managerprofile'):
         if ManagerBlockedDate.objects.filter(
            manager=manager.managerprofile,
            date=event.event_date
        ).exists():
            return Response(
                {"detail": "Manager is not available on the selected date."},
                status=400
            )
             
    # Check if already booked (CONFIRMED or ACCEPTED?)
    # For now, let's assume CONFIRMED blocks it. ACCEPTED also blocks it via ManagerBlockedDate.
    # So the above check actually covers ACCEPTED bookings too because we create a BlockedDate on accept!
    # Double check: does accepting create a block? YES, per my plan.
    # So checking ManagerBlockedDate is sufficient for both manual blocks and accepted bookings.
    
    booking = Booking.objects.create(
        event=event,
        user=request.user,
        manager=manager,
        status="PENDING" 
    )

    return Response({"message": "Booking request sent", "booking_id": booking.id})


@api_view(["POST"])
@permission_classes([IsActiveManager])
def accept_booking(request, booking_id):
    try:
        booking = Booking.objects.select_related('event', 'manager').get(
            id=booking_id,
            manager=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {"detail": "Booking not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != "PENDING":
        return Response(
            {"detail": "Booking already processed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    event_date = booking.event.event_date

    with transaction.atomic():
        # 🔒 Lock date - Check availability via ManagerBlockedDate
        if not hasattr(request.user, 'managerprofile'):
             return Response({"detail": "Manager profile not found."}, status=400)

        if ManagerBlockedDate.objects.filter(
            manager=request.user.managerprofile,
            date=event_date
        ).exists():
            return Response(
                {"detail": "Date already blocked."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Block to lock the date
        ManagerBlockedDate.objects.create(
            manager=request.user.managerprofile,
            date=event_date
        )

        booking.status = "ACCEPTED"
        booking.accepted_at = timezone.now()
        # Timer logic explicitly deferred to next phase per user request
        booking.save()

    return Response(
        {"detail": "Booking accepted and date locked."},
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsActiveManager])
def reject_booking(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            manager=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {"detail": "Booking not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != "PENDING":
        return Response(
            {"detail": "Booking already processed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = "REJECTED"
    booking.save()

    return Response(
        {"detail": "Booking rejected."},
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsVerifiedUser])
def list_user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")
    
    data = []
    for b in bookings:
        data.append({
            "id": b.id,
            "event_title": b.event.title,
            "manager_email": b.manager.email,
            "status": b.status,
            "payment_deadline": b.payment_deadline,
            "created_at": b.created_at
        })
    
    return Response(data)
