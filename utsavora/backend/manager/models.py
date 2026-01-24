from django.db import models
from accounts.models import ManagerProfile

class ManagerBlockedDate(models.Model):
    manager = models.ForeignKey(
        ManagerProfile, 
        on_delete=models.CASCADE, 
        related_name="blocked_dates"
    )
    date = models.DateField()

    class Meta:
        unique_together = ("manager", "date")

    def __str__(self):
        return f"{self.manager.company_name} blocked {self.date}"
