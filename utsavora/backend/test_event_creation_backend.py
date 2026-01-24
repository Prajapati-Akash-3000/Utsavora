import os
import django
import requests
import json
from datetime import date

# Setup Django to access models/tokens
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def run_test():
    # 1. Get or Create a Test User
    email = "backend_test_user@example.com"
    user, created = User.objects.get_or_create(email=email)
    if created:
        user.set_password("testpass123")
        user.role = "USER"
        user.is_verified = True  # Ensure verified if permissions require it
        user.save()
        print(f"Created test user: {email}")
    else:
        print(f"Using existing test user: {email}")

    # 2. Generate Token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    print("Generated Valid Access Token")

    # 3. Request Payload
    payload = {
        "title": "Backend Test Event",
        "description": "Testing from script",
        "city": "Test City",
        "event_date": str(date.today()), # YYYY-MM-DD
        "is_public": True
    }

    # 4. Send Request
    url = "http://127.0.0.1:8000/api/events/create/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    print(f"\nSending POST to {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        try:
            print("Response Body:", json.dumps(response.json(), indent=2))
        except:
            print("Response Text:", response.text)

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    run_test()
