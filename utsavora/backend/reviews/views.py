from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Review
from .serializers import ReviewSerializer

@method_decorator(cache_page(60 * 5), name='list')
class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.select_related('user').all().order_by("-created_at")
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user
        
        if Review.objects.filter(user=user).exists():
            raise ValidationError("You have already submitted a review.")

        # Automatically set user and role from request
        serializer.save(
            user=user,
            role=getattr(user, 'role', 'USER')
        )
