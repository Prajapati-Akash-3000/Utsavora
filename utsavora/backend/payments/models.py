from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    PAYMENT_STATUS = (
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("REFUNDED", "Refunded"),
        ("RELEASED", "Released"),
    )

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    platform_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    manager_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )

    status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS, default="PENDING"
    )

    transaction_id = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Booking {self.booking.id}"
