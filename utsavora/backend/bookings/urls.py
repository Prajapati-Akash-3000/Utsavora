from django.urls import path
from .views import request_booking, accept_booking, reject_booking, list_user_bookings

urlpatterns = [
    path('list/', list_user_bookings),
    path('request/', request_booking),
    path('accept/<int:booking_id>/', accept_booking),
    path('reject/<int:booking_id>/', reject_booking),
]
