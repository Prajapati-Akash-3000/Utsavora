from rest_framework import generics, permissions
from .models import Package
from .serializers import PackageSerializer

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

class ManagerPackageListCreateView(generics.ListCreateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        if hasattr(self.request.user, 'manager_profile'):
            return Package.objects.filter(manager=self.request.user.manager_profile)
        return Package.objects.none()

class ManagerPackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsManager]
    lookup_field = 'id'

    def get_queryset(self):
        if hasattr(self.request.user, 'manager_profile'):
            return Package.objects.filter(manager=self.request.user.manager_profile)
        return Package.objects.none()
