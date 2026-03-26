from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='user.full_name', read_only=True)
    reviewer_id = serializers.IntegerField(source='user.id', read_only=True)
    reviewer_email = serializers.EmailField(source='user.email', read_only=True)
    reviewer_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer_id",
            "reviewer_name",
            "reviewer_email",
            "reviewer_role",
            "rating",
            "comment",
            "created_at"
        ]
        read_only_fields = ["user", "created_at"]

