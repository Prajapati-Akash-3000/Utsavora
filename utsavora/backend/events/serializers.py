from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ["user"]
        read_only_fields = ["status"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Event.objects.create(user=user, **validated_data)
