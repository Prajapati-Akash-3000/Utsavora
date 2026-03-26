from django.db import models

class Payment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
        ('ESCROW', 'Escrow'),
        ('RELEASED', 'Released'),
    )

    PAYMENT_TYPES = (
        ('ADVANCE', 'Advance'),
        ('FINAL', 'Final'),
        ('FULL', 'Full'),
    )

    booking = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE, related_name='payments')
    razorpay_order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    manager_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, default='FULL')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} - {self.booking.event.title} - {self.status}"
