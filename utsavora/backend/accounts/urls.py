from django.urls import path
from . import views
from .views import (
    register,
    LoginView,
    ManagerProfileSearchView,
    ManagerProfileView,
    UserProfileView,
    forgot_password,
    reset_password,
    verify_otp,
    verify_reset_otp,
    # resend_otp,
    # add_or_update_bank_details
)
from .admin_views import (
    pending_Managers, 
    approve_ManagerProfile, 
    reject_ManagerProfile,
    block_ManagerProfile,
    unblock_ManagerProfile
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register),
    path('verify-otp/', verify_otp),
    path('forgot-password/', forgot_password),
    path('password-reset/verify/', verify_reset_otp),
    path('reset-password/', reset_password),
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view()),
    path('Managers/', ManagerProfileSearchView.as_view()),
    
    # Admin Routes
    path('admin/pending-Managers/', pending_Managers),
    path('admin/approve-ManagerProfile/<int:ManagerProfile_id>/', approve_ManagerProfile),
    path('admin/reject-ManagerProfile/<int:ManagerProfile_id>/', reject_ManagerProfile),
    path('admin/block-ManagerProfile/<int:ManagerProfile_id>/', block_ManagerProfile),
    path('admin/unblock-ManagerProfile/<int:ManagerProfile_id>/', unblock_ManagerProfile),

    path('manager/profile/', ManagerProfileView.as_view()),

    # Manager Availability Routes
    path('manager/availability/', views.manager_availability, name="manager-availability"),
    path('manager/availability/add/', views.BlockDateView.as_view()),
    path('manager/availability/remove/', views.remove_blocked_date),
    
    # Manager Earnings Route
    path('manager/earnings/', views.ManagerEarningsView.as_view()),
]
