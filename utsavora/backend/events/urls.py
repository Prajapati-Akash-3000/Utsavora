from django.urls import path
from .views import create_event, my_events

urlpatterns = [
    path("create/", create_event),
    path("my-events/", my_events),
]
