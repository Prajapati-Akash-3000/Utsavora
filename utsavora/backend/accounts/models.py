from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('USER', 'User'),
        ('MANAGER', 'Manager'),
        ('ADMIN', 'Admin'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    full_name = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=15, null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"


class ManagerProfile(models.Model):
    MANAGER_STATUS = (
        ('PENDING', 'Pending'),
        ('ACTIVE', 'Active'),
        ('BLOCKED', 'Blocked'),
        ('REJECTED', 'Rejected'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manager_profile')
    
    company_name = models.CharField(max_length=255)
    certificate = models.FileField(upload_to='certificates/', null=True, blank=True)

    bank_added = models.BooleanField(default=False)

    manager_status = models.CharField(
        max_length=20,
        choices=MANAGER_STATUS,
        default='PENDING'
    )
    approved_by = models.ForeignKey(
        'AdminProfile',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_managers'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.company_name

class BankDetails(models.Model):
    manager = models.OneToOneField(ManagerProfile, on_delete=models.CASCADE, related_name='bank_details')
    account_holder_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    ifsc_code = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=100)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Bank - {self.manager.company_name}"

class ManagerAvailability(models.Model):
    manager = models.ForeignKey(ManagerProfile, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    status = models.CharField(max_length=20, default='BLOCKED')
    booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('manager', 'date')

    def __str__(self):
        return f"{self.manager.company_name} - {self.date}"

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    employee_id = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Admin: {self.user.email}"

class EmailOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)
        super().save(*args, **kwargs)

    def is_expired(self):
        if not self.expires_at:
            return True
        return timezone.now() > self.expires_at

class AuditLog(models.Model):
    ACTIONS = (
        ("LOGIN_SUCCESS", "Login Success"),
        ("LOGIN_FAILED", "Login Failed"),
        ("OTP_SENT", "OTP Sent"),
        ("OTP_FAILED", "OTP Failed"),
        ("PASSWORD_RESET", "Password Reset"),
        ("MANAGER_APPROVED", "Manager Approved"),
        ("MANAGER_REJECTED", "Manager Rejected"),
    )

    user_email = models.EmailField(null=True, blank=True)
    admin = models.ForeignKey('AdminProfile', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTIONS)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    meta = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.action} - {self.user_email}"
