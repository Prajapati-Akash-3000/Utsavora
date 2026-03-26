from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    manager_email = serializers.CharField(source='manager.user.email', read_only=True)
    manager_company = serializers.CharField(source='manager.company_name', read_only=True)
    manager_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = '__all__'

    def get_manager_name(self, obj):
        if obj.manager and obj.manager.user:
            return obj.manager.user.full_name or obj.manager.user.username or obj.manager.company_name
        return "Professional Manager"
