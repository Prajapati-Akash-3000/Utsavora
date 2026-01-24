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

User = get_user_model()

def run_test():
    # 1. Get or Create a Test Manager
    email = "backend_test_manager@example.com"
    user, created = User.objects.get_or_create(email=email)
    if not created:
       # Ensure roles correct if reused
       user.role = "MANAGER"
       user.is_verified = True
       user.manager_status = 'ACTIVE'
       user.save()
       print(f"Using test manager: {email}")

    # 2. Generate Token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    print("Generated Valid Access Token")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # 3. Test Block Date (Accounts App)
    block_payload = {
        "date": str(date.today() + timedelta(days=10)),
        "reason": "Verify Script Test"
    }
    block_url = "http://127.0.0.1:8000/api/accounts/manager/availability/add/"
    
    print(f"\n[POST] Blocking Date {block_payload['date']}...")
    try:
        res = requests.post(block_url, json=block_payload, headers=headers)
        print(f"Status: {res.status_code}")
        print("Body:", res.json())
        blocked_id = res.json().get('id')
    except Exception as e:
        print(f"Block date failed: {e}")
        blocked_id = None

    # 4. Test List Blocked Dates
    list_url = "http://127.0.0.1:8000/api/accounts/manager/availability/"
    print(f"\n[GET] Listing Blocked Dates...")
    try:
        res = requests.get(list_url, headers=headers)
        print(f"Status: {res.status_code}")
        print("Count:", len(res.json()))
    except Exception as e:
        print(f"List failed: {e}")

    # 5. Test Delete
    if blocked_id:
        del_url = f"http://127.0.0.1:8000/api/accounts/manager/availability/{blocked_id}/delete/"
        print(f"\n[DELETE] Deleting ID {blocked_id}...")
        try:
            res = requests.delete(del_url, headers=headers)
            print(f"Status: {res.status_code}")
        except Exception as e:
            print(f"Delete failed: {e}")

if __name__ == "__main__":
    run_test()
