from django.db import models
from django.utils import timezone
from datetime import timedelta
from accounts.models import User

class InvitationTemplate(models.Model):


    name = models.CharField(max_length=100)
    template_key = models.CharField(max_length=50, unique=True, help_text="Matches frontend component key, e.g. wedding_classic")
    category = models.CharField(max_length=50) # Simplified as per user request
    
    preview_image = models.ImageField(upload_to="invitation_previews/", blank=True, null=True)
    html_content = models.TextField(blank=True, default="") # New field
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    EVENT_STATUS = (
        ("DRAFT", "Draft"),
        ("PENDING", "Pending"),
        ("ACTIVE", "Active"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    )

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # New Fields
    contact_numbers = models.CharField(max_length=255, blank=True)
    start_date = models.DateField(null=True, blank=True) # Temporarily nullable for migration
    end_date = models.DateField(null=True, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    
    city = models.CharField(max_length=100)
    category = models.CharField(max_length=100, default="General") # Added for public search
    
    # Deprecating event_date but keeping for safety for now
    event_date = models.DateField() 
    
    template = models.ForeignKey(
        InvitationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    invitation_pdf = models.FileField(
        upload_to="invitations/",
        null=True,
        blank=True
    )

    is_public = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=EVENT_STATUS, default="ACTIVE")
    
    visibility = models.CharField(max_length=20, default='PRIVATE', choices=(('PUBLIC', 'Public'), ('PRIVATE', 'Private')))
    pricing_type = models.CharField(max_length=20, default='FREE', choices=(('FREE', 'Free'), ('PAID', 'Paid')))
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.title

    def update_event_status(self):
        """Auto-update status based on date"""
        if self.status == "CANCELLED":
            return
            
        # If end_date is past, mark as COMPLETED
        if self.end_date and self.end_date < timezone.now().date():
            if self.status != "COMPLETED":
                self.status = "COMPLETED"
                # Avoid infinite recursion if save call signals, but explicit update_fields is safe
                self.save(update_fields=["status"])
        
        # Fallback for old events without end_date (using event_date)
        elif self.event_date and self.event_date < timezone.now().date():
             if self.status != "COMPLETED":
                self.status = "COMPLETED"
                self.save(update_fields=["status"])
    status = models.CharField(max_length=20, choices=EVENT_STATUS, default="DRAFT")

    # Invitation Builder Fields
    invitation_template_key = models.CharField(max_length=50, blank=True, null=True) # e.g. 'wedding', 'birthday'
    invitation_data = models.JSONField(default=dict, blank=True) # Stores dynamic data for the card

    created_at = models.DateTimeField(auto_now_add=True)

    visibility = models.CharField(
        max_length=10,
        choices=(('PRIVATE', 'Private'), ('PUBLIC', 'Public')),
        default='PRIVATE'
    )
    pricing_type = models.CharField(
        max_length=10,
        choices=(('FREE', 'Free'), ('PAID', 'Paid')),
        null=True,
        blank=True
    )
    registration_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )

    def __str__(self):
        if self.created_by:
            return f"{self.title} - {self.created_by.email}"
        return f"{self.title} - No User"

    def media_upload_deadline(self):
        # Fallback to start_date or created_at if end_date doesn't exist (safety)
        target_date = self.end_date or self.start_date or self.created_at.date()
        return timezone.make_aware(
            timezone.datetime.combine(
                target_date + timedelta(days=10),
                timezone.datetime.max.time()
            )
        )

    def can_upload_media(self):
        return timezone.now() <= self.media_upload_deadline()

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

class EventMedia(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="media")
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="event_media/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event.title} - Media"

class PublicEventRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    
    payment_status = models.CharField(
        max_length=10,
        choices=[("FREE", "Free"), ("PENDING", "Pending"), ("PAID", "Paid"), ("FAILED", "Failed")],
        default="FREE"
    )
    status = models.CharField(
        max_length=10,
        choices=[("PENDING", "Pending"), ("CONFIRMED", "Confirmed"), ("CANCELLED", "Cancelled")],
        default="PENDING"
    )
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'email') # Prevent duplicate registration

    def __str__(self):
        return f"{self.full_name} - {self.event.title}"

