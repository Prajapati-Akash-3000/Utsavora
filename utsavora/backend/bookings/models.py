from django.db import models
from accounts.models import User
from events.models import Event
from packages.models import Package
from django.utils import timezone
from datetime import timedelta

class Booking(models.Model):
    BOOKING_STATUS = (
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("REJECTED", "Rejected"),
        ("PAID", "Paid"),
        ("CONFIRMED", "Confirmed"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="manager_bookings")

    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default="PENDING")

    payment_status = models.CharField(
        max_length=20,
        choices=[('UNPAID','Unpaid'), ('PAID','Paid')],
        default='UNPAID'
    )

    payment_id = models.CharField(max_length=100, blank=True, null=True)

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
