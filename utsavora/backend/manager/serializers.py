from rest_framework import serializers
from .models import ManagerBlockedDate

class BlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerBlockedDate
        exclude = ['manager']

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'managerprofile'):
             raise serializers.ValidationError("User does not have a manager profile.")
        
        return ManagerBlockedDate.objects.create(manager=user.managerprofile, **validated_data)
