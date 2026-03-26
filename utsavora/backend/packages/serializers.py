from rest_framework import serializers
from .models import Package
from events.models import EventCategory
from events.serializers import EventCategorySerializer

class PackageSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all(), required=False, allow_null=True
    )
    category_details = EventCategorySerializer(source='category', read_only=True)
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Package
        exclude = ['manager']
        read_only_fields = ['created_at']

    def get_manager_name(self, obj):
        if obj.manager and obj.manager.user:
            return obj.manager.user.full_name or obj.manager.user.username or obj.manager.company_name
        return "Professional Manager"

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'manager_profile'):
             raise serializers.ValidationError("User does not have a manager profile.")
        
        return Package.objects.create(manager=user.manager_profile, **validated_data)
