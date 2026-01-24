
import os
import django
import sys
import json

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from accounts.views import register, verify_otp
from accounts.models import User, EmailOTP, ManagerProfile, UserProfile

def test_unified_flow():
    factory = APIRequestFactory()
    
    print("--- 1. Testing USER Registration ---")
    # Cleanup
    User.objects.filter(email="testuser@example.com").delete()
    
    # Register
    data = {
        "email": "testuser@example.com",
        "password": "password123",
        "full_name": "Test User",
        "role": "USER",
        "phone": "9876543210"
    }
    req = factory.post('/api/auth/register/', data, format='json')
    resp = register(req)
    print(f"Register Resp: {resp.status_code} {resp.data}")
    assert resp.status_code == 200
    assert resp.data['role'] == 'user'
    
    # Verify User Created (Inactive)
    user = User.objects.get(email="testuser@example.com")
    assert user.is_active == False
    assert UserProfile.objects.filter(user=user).exists()
    
    # Get OTP
    otp = EmailOTP.objects.get(user=user).otp
    print(f"OTP Generated: {otp}")
    
    # Verify OTP
    v_data = {"email": "testuser@example.com", "otp": otp}
    v_req = factory.post('/api/auth/verify-otp/', v_data, format='json')
    v_resp = verify_otp(v_req)
    print(f"Verify Resp: {v_resp.status_code} {v_resp.data}")
    
    assert v_resp.status_code == 200
    assert "token" in v_resp.data
    assert "access" in v_resp.data['token'] # Nested check
    assert user.role == "USER"
    
    print("--- 2. Testing MANAGER Registration ---")
    User.objects.filter(email="testmgr@example.com").delete()
    
    m_data = {
        "email": "testmgr@example.com",
        "password": "password123",
        "full_name": "Test Manager",
        "role": "MANAGER",
        "phone": "9876543210",
        "company_name": "Test Corp"
        # certificate skipped for simplicity, or we can mock request.FILES
    }
    # Mocking FILES is hard with pure factory without extra setup, 
    # but let's see if our view handles missing file gracefully or if we made it required
    # In views, we used .get(), so it might be None/Optional in backend logic currently.
    
    req = factory.post('/api/auth/register/', m_data, format='json')
    resp = register(req)
    print(f"Register Resp: {resp.status_code} {resp.data}")
    assert resp.status_code == 200
    
    mgr = User.objects.get(email="testmgr@example.com")
    assert ManagerProfile.objects.filter(user=mgr).exists()
    
    otp = EmailOTP.objects.get(user=mgr).otp
    
    v_data = {"email": "testmgr@example.com", "otp": otp}
    v_req = factory.post('/api/auth/verify-otp/', v_data, format='json')
    v_resp = verify_otp(v_req)
    print(f"Verify Resp: {v_resp.status_code} {v_resp.data}")
    
    assert v_resp.status_code == 200
    assert "access" not in v_resp.data # NO Auto login
    assert "approval" in v_resp.data['message'].lower()
    
    print("\n✅ All Tests Passed!")

if __name__ == "__main__":
    try:
        test_unified_flow()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"\n❌ Test Failed: {e}")
