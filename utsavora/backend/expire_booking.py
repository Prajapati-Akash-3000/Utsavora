import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.models import Booking

def expire_booking():
    booking = Booking.objects.filter(status='PAYMENT_PENDING').last()
    if not booking:
        print("No booking found with status PAYMENT_PENDING")
        return

    print(f"Found booking ID {booking.id} with status {booking.status}")
    print(f"Current deadline: {booking.payment_deadline}")

    # Set deadline to 1 day ago
    booking.payment_deadline = timezone.now() - timedelta(days=1)
    booking.save()

    print(f"Updated booking ID {booking.id} payment_deadline to {booking.payment_deadline}")
    print("Booking expired successfully.")

if __name__ == "__main__":
    expire_booking()
