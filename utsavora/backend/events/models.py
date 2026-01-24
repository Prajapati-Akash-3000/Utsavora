from django.db import models
from django.utils import timezone
from accounts.models import User

class Event(models.Model):
    EVENT_STATUS = (
        ("DRAFT", "Draft"),
        ("ACTIVE", "Active"),
        ("BOOKED", "Booked"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    event_date = models.DateField()
    is_public = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=EVENT_STATUS, default="DRAFT")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return f"{self.title} - {self.user.email}"
        return f"{self.title} - No User"

from django.utils import timezone

class ServicePackage(models.Model):
    EVENT_TYPES = (
        ('WEDDING', 'Wedding'),
        ('BIRTHDAY', 'Birthday'),
        ('CORPORATE', 'Corporate'),
        ('GENERAL', 'General'),
    )

    manager = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='packages')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    features = models.JSONField(default=list)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.manager.email}"
