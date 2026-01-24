from django.urls import path
from .views import ManagerBlockedDateListCreateView, UnblockDateView, CalendarView

urlpatterns = [
    path('calendar/', CalendarView.as_view(), name='calendar'),
    path('block-date/', ManagerBlockedDateListCreateView.as_view(), name='block-date'),
    path('blocked-dates/', ManagerBlockedDateListCreateView.as_view(), name='blocked-dates'),
    path('block-date/<int:pk>/', UnblockDateView.as_view(), name='unblock-date'),
]
