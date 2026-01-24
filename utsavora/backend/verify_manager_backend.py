import os
import django
import requests
import json
from datetime import date, timedelta

# Setup Django to access models/tokens
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import ManagerProfile
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def run_test():
    # 1. Get or Create a Test Manager
    email = "backend_test_manager@example.com"
    user, created = User.objects.get_or_create(email=email)
    if created:
        user.set_password("testpass123")
        user.role = "MANAGER"
        user.full_name = "Test Manager"
        user.is_verified = True
        user.manager_status = 'ACTIVE'
        user.save()
        
        # Create Profile
        if not hasattr(user, 'managerprofile'):
            ManagerProfile.objects.create(
                user=user, 
                company_name="Test Events Co", 
                city="Mumbai"
            )
        print(f"Created test manager: {email}")
    else:
        print(f"Using existing test manager: {email}")
        if not hasattr(user, 'managerprofile'):
             ManagerProfile.objects.create(
                user=user, 
                company_name="Test Events Co", 
                city="Mumbai"
            )

    # 2. Generate Token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    print("Generated Valid Access Token")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # 3. Test Create Package
    pkg_payload = {
        "title": "Gold Wedding Package",
        "description": "Full service",
        "price": 50000.00
    }
    pkg_url = "http://127.0.0.1:8000/api/manager/packages/"
    
    print(f"\n[POST] Creating Package at {pkg_url}...")
    try:
        res = requests.post(pkg_url, json=pkg_payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Body:", res.json())
    except Exception as e:
        print(f"Package create failed: {e}")

    # 4. Test List Packages
    print(f"\n[GET] Listing Packages...")
    try:
        res = requests.get(pkg_url, headers=headers)
        print(f"Status: {res.status_code}")
        print("Count:", len(res.json()))
    except Exception as e:
        print(f"Package list failed: {e}")

    # 5. Test Block Date
    block_payload = {
        "date": str(date.today() + timedelta(days=5))
    }
    block_url = "http://127.0.0.1:8000/api/manager/block-date/"
    
    print(f"\n[POST] Blocking Date {block_payload['date']}...")
    try:
        res = requests.post(block_url, json=block_payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Body:", res.json())
        blocked_id = res.json().get('id')
    except Exception as e:
        print(f"Block date failed: {e}")
        blocked_id = None

    # 6. Test List Blocked Dates
    list_block_url = "http://127.0.0.1:8000/api/manager/blocked-dates/"
    print(f"\n[GET] Listing Blocked Dates...")
    try:
        res = requests.get(list_block_url, headers=headers)
        print(f"Status: {res.status_code}")
        print("Body:", res.json())
    except Exception as e:
        print(f"List blocked dates failed: {e}")

    # 7. Test Unblock Date
    if blocked_id:
        unblock_url = f"http://127.0.0.1:8000/api/manager/block-date/{blocked_id}/"
        print(f"\n[DELETE] Unblocking Date ID {blocked_id}...")
        try:
            res = requests.delete(unblock_url, headers=headers)
            print(f"Status: {res.status_code}")
        except Exception as e:
            print(f"Unblock date failed: {e}")

if __name__ == "__main__":
    run_test()
