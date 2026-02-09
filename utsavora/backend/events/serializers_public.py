from rest_framework import serializers
from .models import PublicEventRegistration

class PublicAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicEventRegistration
        fields = [
            "id",
            "full_name",
            "email",
            "mobile",
            "created_at"
        ]

class PublicEventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicEventRegistration
        exclude = ('event', 'payment_status', 'razorpay_order_id', 'razorpay_payment_id', 'amount_paid', 'razorpay_signature', 'status')
