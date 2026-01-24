from django.db import models
from accounts.models import User
from events.models import Event
from django.utils import timezone
from datetime import timedelta

class Booking(models.Model):
    BOOKING_STATUS = (
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("REJECTED", "Rejected"),
        ("PAYMENT_PENDING", "Payment Pending"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="manager_bookings")

    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default="PENDING")

    accepted_at = models.DateTimeField(null=True, blank=True)
    payment_deadline = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def start_payment_timer(self):
        self.payment_deadline = timezone.now() + timedelta(hours=10)
        self.status = "PAYMENT_PENDING"
        self.save()

    def is_payment_expired(self):
        return self.payment_deadline and timezone.now() > self.payment_deadline

    def __str__(self):
        return f"{self.event.title} → {self.manager.email}"

class ManagerAvailability(models.Model):
    manager = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="blocked_dates"
    )
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="availability"
    )
    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["manager", "start_date", "end_date"])
        ]

    def __str__(self):
        return f"{self.manager.email} blocked {self.start_date} → {self.end_date}"
