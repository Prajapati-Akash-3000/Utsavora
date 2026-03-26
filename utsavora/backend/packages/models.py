from django.db import models

class Package(models.Model):
    manager = models.ForeignKey('accounts.ManagerProfile', on_delete=models.CASCADE, related_name='managed_packages')

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    category = models.ForeignKey(
        'events.EventCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.manager.company_name}"
