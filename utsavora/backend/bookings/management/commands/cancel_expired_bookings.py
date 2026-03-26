from django.core.management.base import BaseCommand
from django.utils import timezone
from bookings.models import Booking


class Command(BaseCommand):
    help = "Cancel bookings where the 1-hour payment window has expired after ManagerProfile acceptance."

    def handle(self, *args, **options):
        now = timezone.now()

        expired_bookings = Booking.objects.filter(
            status="ACCEPTED",
            payment_status="UNPAID",
            payment_deadline__lt=now,
        )

        count = expired_bookings.count()

        for booking in expired_bookings:
            booking.status = "CANCELLED"
            booking.save(update_fields=["status"])

            # Revert event status so user can hire another ManagerProfile
            event = booking.event
            if event.status not in ("COMPLETED", "CANCELLED"):
                event.status = "ACTIVE"
                event.save(update_fields=["status"])

            self.stdout.write(
                self.style.WARNING(
                    f"Cancelled booking #{booking.id} for event '{booking.event.title}' "
                    f"(deadline was {booking.payment_deadline})"
                )
            )

        if count:
            self.stdout.write(self.style.SUCCESS(f"Cancelled {count} expired booking(s)."))
        else:
            self.stdout.write(self.style.SUCCESS("No expired bookings found."))
