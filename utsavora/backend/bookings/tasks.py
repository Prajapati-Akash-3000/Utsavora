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

from events.services.email_service import email_event_completed

def complete_events():
    from events.models import Event
    
    events = Event.objects.filter(
        end_date__lt=timezone.now().date(),
        status="ACTIVE"
    )

    for event in events:
        event.status = "COMPLETED"
        event.save()

        try:
            email_event_completed(event)
            print(f"Marked event {event.id} as COMPLETED and emailed")
        except Exception as e:
             print(f"⚠️ Email Error (Event Completion {event.id}): {e}")
