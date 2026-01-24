import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.models import Booking, ManagerAvailability

def verify_cancellation():
    try:
        booking = Booking.objects.get(id=3)
        print(f"Booking ID 3 Status: {booking.status}")
        
        # Check if availability is deleted
        availability_exists = ManagerAvailability.objects.filter(booking=booking).exists()
        print(f"ManagerAvailability exists for booking 3? {availability_exists}")
        
        if booking.status == "CANCELLED" and not availability_exists:
            print("SUCCESS: Booking cancelled and dates released.")
        else:
            print(f"FAILURE: Status={booking.status}, DatesReleased={not availability_exists}")
            
    except Booking.DoesNotExist:
        print("Booking ID 3 not found.")

if __name__ == "__main__":
    verify_cancellation()
