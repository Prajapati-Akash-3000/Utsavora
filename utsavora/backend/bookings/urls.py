from django.urls import path
from .views import request_booking, accept_booking, reject_booking, list_user_bookings, create_booking, list_manager_requests, booking_conflicts

urlpatterns = [
    path('list/', list_user_bookings),
    path('manager/requests/', list_manager_requests),
    path('create/', create_booking),
    path('request/', request_booking),
    path('accept/<int:booking_id>/', accept_booking),
    path('reject/<int:booking_id>/', reject_booking),
    path('conflicts/<int:booking_id>/', booking_conflicts),
]
