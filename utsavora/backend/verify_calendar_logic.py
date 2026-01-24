import os
import requests
import json
from datetime import date, timedelta
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from events.models import Event
from bookings.models import Booking
from accounts.models import ManagerAvailability

User = get_user_model()

def run_test():
    # 1. Setup Data
    manager, _ = User.objects.get_or_create(email="cal_test_manager@example.com", defaults={"role": "MANAGER", "manager_status": "ACTIVE"})
    user, _ = User.objects.get_or_create(email="cal_test_user@example.com", defaults={"role": "USER"})
    
    # Dates
    date_booked = date.today() + timedelta(days=50)
    date_blocked = date.today() + timedelta(days=55)
    
    # 2. Create Confirmed Booking
    event = Event.objects.create(
        user=user, 
        title="Valid Booking Event", 
        event_date=date_booked, 
        city="Test City",
        status="ACTIVE"
    )
    Booking.objects.create(
        event=event,
        user=user,
        manager=manager,
        status="CONFIRMED"
    )
    print(f"Created Booking on {date_booked} (CONFIRMED)")

    # 3. Create Manual Block
    ManagerAvailability.objects.create(manager=manager, date=date_blocked)
    print(f"Blocked Date {date_blocked} (Manual)")

    # 4. Fetch Calendar
    refresh = RefreshToken.for_user(manager)
    token = str(refresh.access_token)
    headers = {"Authorization": f"Bearer {token}"}
    
    url = "http://127.0.0.1:8000/api/accounts/manager/availability/"
    
    print("\n[GET] Fetching Availability...")
    res = requests.get(url, headers=headers)
    print(f"Status: {res.status_code}")
    data = res.json()
    
    # 5. Analyze Results
    booked_entry = next((item for item in data if item["date"] == str(date_booked)), None)
    blocked_entry = next((item for item in data if item["date"] == str(date_blocked)), None)
    
    if booked_entry and booked_entry["type"] == "BOOKED":
        print("✅ Correctly identified BOOKED date.")
    else:
        print(f"❌ Failed to identify BOOKED date. Found: {booked_entry}")

    if blocked_entry and blocked_entry["type"] == "BLOCKED":
        print("✅ Correctly identified BLOCKED date.")
    else:
        print(f"❌ Failed to identify BLOCKED date. Found: {blocked_entry}")

    # Cleanup
    # event.delete()
    # ManagerAvailability.objects.filter(manager=manager, date=date_blocked).delete()

if __name__ == "__main__":
    run_test()
