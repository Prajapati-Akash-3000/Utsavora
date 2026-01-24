from django.urls import path
from .views import ManagerPackageListCreateView, ManagerPackageDetailView

urlpatterns = [
    path('manager/packages/', ManagerPackageListCreateView.as_view(), name='manager-packages'),
    path('manager/packages/<int:id>/', ManagerPackageDetailView.as_view(), name='manager-package-detail'),
]
