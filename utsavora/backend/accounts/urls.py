from django.urls import path
from . import views
from .views import (
    register,
    LoginView,
    ManagerSearchView,
    ManagerProfileView,
    forgot_password,
    reset_password,
    verify_otp,
    resend_otp,
    add_or_update_bank_details
)
from .admin_views import (
    pending_managers, 
    approve_manager, 
    reject_manager,
    block_manager,
    unblock_manager
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register),
    path('verify-otp/', verify_otp),
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('managers/', ManagerSearchView.as_view()),
    
    # Admin Routes
    path('admin/pending-managers/', pending_managers),
    path('admin/approve-manager/<int:manager_id>/', approve_manager),
    path('admin/reject-manager/<int:manager_id>/', reject_manager),
    path('admin/block-manager/<int:manager_id>/', block_manager),
    path('admin/unblock-manager/<int:manager_id>/', unblock_manager),

    path('manager/profile/', ManagerProfileView.as_view()),

    path('forgot-password/', forgot_password),
    path('reset-password/', reset_password),
    path('manager/bank-details/', add_or_update_bank_details),

    # Manager Availability Routes
    path('manager/availability/', views.get_manager_availability),
    path('manager/availability/add/', views.BlockDateView.as_view()),
    path('manager/availability/remove/', views.remove_blocked_date),
    path('manager/earnings/', views.manager_earnings),
]
