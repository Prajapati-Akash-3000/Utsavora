from django.core.management.base import BaseCommand
from django.utils.timezone import now
from bookings.models import Booking
from accounts.models import ManagerAvailability

class Command(BaseCommand):
    help = "Auto-releases manager dates for completed events and marks booking as COMPLETED"

    def handle(self, *args, **kwargs):
        today = now().date()
        
        # Find bookings that are CONFIRMED and whose event end_date is in the past
        # Note: Depending on logic, we might use end_date < today
        
        expired_bookings = Booking.objects.filter(
            status="CONFIRMED",
            event__end_date__lt=today
        )

        completed_count = 0
        released_dates_count = 0

        for booking in expired_bookings:
            # Release dates (delete ManagerAvailability tied to this booking)
            deleted, _ = ManagerAvailability.objects.filter(
                booking=booking
            ).delete()
            
            released_dates_count += deleted
            
            # Mark as COMPLETED
            booking.status = "COMPLETED"
            booking.save()
            
            completed_count += 1
            
            self.stdout.write(self.style.SUCCESS(f"Completed booking {booking.id} ({booking.event.title})"))

        self.stdout.write(self.style.SUCCESS(f"Processed {completed_count} bookings, released {released_dates_count} dates."))
