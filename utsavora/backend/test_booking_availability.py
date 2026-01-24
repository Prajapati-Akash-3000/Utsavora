import os
import django
import requests
import json
from datetime import date, timedelta

# Setup Django to access models/tokens
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from events.models import Event
from accounts.models import ManagerAvailability

User = get_user_model()

def run_test():
    # 1. Setup Data
    # Get Manager
    manager = User.objects.filter(role="MANAGER", manager_status="ACTIVE").first()
    if not manager:
        print("No active manager found. Please create one.")
        return

    # Get User
    user = User.objects.filter(role="USER").first()
    if not user:
        print("No user found.")
        return

    # Create Event for Tomorrow
    event_date = date.today() + timedelta(days=20)
    event = Event.objects.create(
        user=user,
        title="Availability Test Event",
        event_date=event_date,
        city="Test City",
        status="ACTIVE"
    )
    print(f"Created Event: {event.title} on {event.event_date}")

    # 2. Block the Date for Manager
    ManagerAvailability.objects.get_or_create(manager=manager, date=event_date, reason="Test Block")
    print(f"Blocked Date: {event_date} for Manager: {manager.email}")

    # 3. Attempt Booking
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    url = "http://127.0.0.1:8000/api/bookings/request/" # Assuming endpoint name, double check urls.py if fail
    payload = {
        "event_id": event.id,
        "manager_id": manager.id
    }
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    print("\n[POST] Requesting Booking on Blocked Date...")
    try:
        res = requests.post(url, json=payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Body:", res.json())
        
        if res.status_code == 400 and "Manager is not available" in str(res.json()):
             print("\n✅ SUCCESS: Booking correctly rejected.")
        else:
             print("\n❌ FAILURE: Booking should have been rejected.")

    except Exception as e:
        print(f"Request failed: {e}")

    # Cleanup (Optional)
    # event.delete()
    # ManagerAvailability.objects.filter(manager=manager, date=event_date).delete()

if __name__ == "__main__":
    run_test()
