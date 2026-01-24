from rest_framework import serializers
from .models import Package

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        exclude = ['manager']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        # Ensure user has a manager profile
        if not hasattr(user, 'managerprofile'):
             raise serializers.ValidationError("User does not have a manager profile.")
        
        return Package.objects.create(manager=user.managerprofile, **validated_data)
