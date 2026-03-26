from django.db import models
from django.utils import timezone
from datetime import timedelta

class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Event Categories"

    def __str__(self):
        return self.name

class InvitationTemplate(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='templates')
    preview_image = models.ImageField(upload_to='templates/previews/', null=True, blank=True)
    html_content = models.TextField(help_text="HTML template with {{ placeholders }}")
    template_key = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Event(models.Model):
    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Created'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        COMPLETED = 'COMPLETED', 'Completed'
    
    VISIBILITY_CHOICES = (
        ('PRIVATE', 'Private'),
        ('PUBLIC', 'Public'),
    )

    PRICING_CHOICES = (
        ('FREE', 'Free'),
        ('PAID', 'Paid'),
    )

    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Core Dates & Times
    start_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    venue = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Invitation Data
    template = models.ForeignKey(InvitationTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    invitation_data = models.JSONField(default=dict, blank=True)
    invitation_pdf = models.FileField(upload_to='invitations/pdfs/', null=True, blank=True)
    
    # Public Event Settings
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='PRIVATE')
    pricing_type = models.CharField(max_length=10, choices=PRICING_CHOICES, default='FREE')
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Extra Info
    contact_numbers = models.CharField(max_length=255, blank=True)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)
    
    media_upload_deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.media_upload_deadline and self.start_date:
             # Default deadline is 48 hours after event start
             start_datetime = timezone.make_aware(timezone.datetime.combine(self.start_date, self.start_time or timezone.datetime.min.time()))
             self.media_upload_deadline = start_datetime + timedelta(hours=48)
        super().save(*args, **kwargs)

    def can_upload_media(self):
        if not self.media_upload_deadline:
            return True
        return timezone.now() < self.media_upload_deadline

    def update_event_status(self):
        now = timezone.now().date()
        if self.status in [self.Status.CREATED, self.Status.CONFIRMED] and self.end_date and self.end_date < now:
            self.status = self.Status.COMPLETED
            self.save()

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['visibility', 'status', 'start_date'], name='idx_event_public_search'),
            models.Index(fields=['created_by', '-created_at'], name='idx_event_user_dashboard'),
            models.Index(fields=['status', 'end_date'], name='idx_event_status_autoclose'),
        ]

class EventMedia(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="media")
    image = models.ImageField(upload_to="event_media/")
    uploaded_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media for {self.event.title}"

class PublicEventRegistration(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    )
    
    PAYMENT_STATUS = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'email')

    def __str__(self):
        return f"{self.full_name} - {self.event.title}"
