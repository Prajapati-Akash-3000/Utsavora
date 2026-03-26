from django.db import models
from django.utils import timezone

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

    PAYMENT_STATUS = (
        ("UNPAID", "Unpaid"),
        ("PARTIALLY_PAID", "Partially Paid"),
        ("FULLY_PAID", "Fully Paid"),
        ("REFUNDED", "Refunded"),
    )

    event = models.ForeignKey('events.Event', on_delete=models.CASCADE)
    package = models.ForeignKey('packages.Package', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="bookings")
    manager = models.ForeignKey('accounts.ManagerProfile', on_delete=models.CASCADE, related_name="managed_bookings", null=True, blank=True)

    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default="PENDING")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="UNPAID")
    payment_id = models.CharField(max_length=255, null=True, blank=True)
    payment_deadline = models.DateTimeField(null=True, blank=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        manager_name = self.manager.company_name if self.manager else "No Manager"
        return f"{self.event.title} - {manager_name}"

    def start_payment_timer(self):
        # Dummy method to avoid errors in views
        pass
