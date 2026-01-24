from django.utils import timezone
from .models import Booking, ManagerAvailability

def expire_unpaid_bookings():
    expired = Booking.objects.filter(
        status="PAYMENT_PENDING",
        payment_deadline__lt=timezone.now()
    )

    for booking in expired:
        booking.status = "CANCELLED"
        booking.save()

        # 🔓 Release blocked dates
        ManagerAvailability.objects.filter(
            booking=booking
        ).delete()
