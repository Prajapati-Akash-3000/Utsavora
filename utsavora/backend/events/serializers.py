from rest_framework import serializers
from .models import Event, ServicePackage, InvitationTemplate, EventMedia, PublicEventRegistration

from bookings.models import Booking
from django.utils import timezone
from datetime import timedelta

class EventMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventMedia
        fields = ['id', 'image', 'created_at']

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
             return request.build_absolute_uri(obj.image.url)
        return None

class InvitationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitationTemplate
        fields = '__all__'

class PublicEventSerializer(serializers.ModelSerializer):
    template_details = InvitationTemplateSerializer(source='template', read_only=True)
    is_registration_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'start_date', 'end_date', 'venue', 'city', 'category',
            'pricing_type', 'registration_fee', 'template_details', 'description', 
            'contact_numbers', 'is_registration_open'
        ]

    def get_is_registration_open(self, obj):
        # Registration is open if current date is before the start date
        if not obj.start_date:
            return False 
        return timezone.now().date() < obj.start_date



class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    service_package = ServicePackageSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ["status", "payment_status"]

class EventSerializer(serializers.ModelSerializer):
    manager_booking = serializers.SerializerMethodField()
    # Explicitly include new fields if needed, or rely on Meta fields since we used exclude
    # exclude = ["user"] handles most, but we want to ensure template details are nested or ID is handled
    
    template_details = InvitationTemplateSerializer(source='template', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'contact_numbers', 
            'start_date', 'end_date', 'venue', 'city', 
            'event_date', 'status', 'is_public', 
            'visibility', 'pricing_type', 'registration_fee',
            'template', 'template_details', 'invitation_template_key', 'invitation_data',
            'invitation_pdf', 'created_at', 'manager_booking'
        ]
        read_only_fields = ['status', 'invitation_pdf', 'created_at', 'manager_booking', 'is_public']

    def validate(self, data):
        # Default visibility logic
        visibility = data.get('visibility', 'PRIVATE')
        
        if visibility == 'PUBLIC':
            if not data.get('pricing_type'):
                raise serializers.ValidationError({"pricing_type": "Pricing type is required for public events."})
            
            if data['pricing_type'] == 'PAID':
                fee = data.get('registration_fee')
                # Ensure fee is a valid number and positive
                if fee is None:
                     raise serializers.ValidationError({"registration_fee": "Registration fee is required for paid events."})
                try:
                    if float(fee) <= 0:
                        raise serializers.ValidationError({"registration_fee": "Fee must be greater than 0."})
                except (ValueError, TypeError):
                     raise serializers.ValidationError({"registration_fee": "Invalid fee format."})
        return data

    def get_manager_booking(self, obj):
        # Return the most recent active booking for this event
        booking = obj.booking_set.exclude(status='REJECTED').last()
        if booking:
            fields = [
            'title', 'description', 'start_date', 'end_date', 
            'venue', 'city', 'is_public', 'template', 
            'invitation_template_key', 'invitation_data',
            'created_by_email', 'status', 'created_at'
        ]
            return {
                "id": booking.id,
                "status": booking.status,
                "payment_status": booking.payment_status
            }
        return None


class EventDetailSerializer(EventSerializer):
    media = EventMediaSerializer(many=True, read_only=True)
    can_upload_media = serializers.SerializerMethodField()
    upload_limit = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'contact_numbers', 'start_date', 'end_date', 
            'venue', 'city', 'event_date', 'is_public', 'status', 'created_at', 
            'invitation_pdf', 'template', 'template_details', 
            'invitation_template_key', 'invitation_data', 
            'manager_booking', 'media', 'can_upload_media', 'upload_limit', 'media_upload_deadline'
        ]

    def get_can_upload_media(self, obj):
        # Delegate to model method which handles the strict time window
        if not obj.can_upload_media():
            return False
            
        # Also check ownership (optional, depending on requirements, but safe to keep)
        request = self.context.get("request")
        if request and request.user != obj.created_by:
            return False
            
        return True

    def get_upload_limit(self, obj):
        # Check for accepted AND paid booking (Robust latest check)
        booking = Booking.objects.filter(event=obj).order_by("-created_at").first()
        
        has_manager_access = (
            booking and 
            booking.status == "CONFIRMED" and 
            booking.payment_status == "PAID"
        )
        return 20 if has_manager_access else 5

