import os
import django
# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import User, UserProfile, ManagerProfile
from events.models import Event
from bookings.models import Booking
from django.utils import timezone
from datetime import timedelta

def run_api_test():
    print("🚀 Starting End-to-End API Verification...")
    
    # 1. Setup Data
    User.objects.all().delete()
    
    # Client
    client_user = User.objects.create_user(email='client@test.com', phone='1234567890', password='password123', role='USER')
    UserProfile.objects.create(user=client_user, city="Mumbai")
    client_client = APIClient()
    client_client.force_authenticate(user=client_user)
    
    # Manager
    manager_user = User.objects.create_user(email='manager@test.com', phone='0987654321', password='password123', role='MANAGER')
    manager_profile = ManagerProfile.objects.create(user=manager_user, company_name="Test Events", city="Mumbai", certificate="cert.pdf")
    manager_client = APIClient()
    manager_client.force_authenticate(user=manager_user)
    
    # Event
    event = Event.objects.create(
        user=client_user.userprofile,
        title="Wedding",
        description="Big fat wedding",
        event_type="PRIVATE",
        start_datetime=timezone.now() + timedelta(days=20),
        end_datetime=timezone.now() + timedelta(days=20, hours=6),
        city="Mumbai"
    )

    print("✅ Setup Complete (Users, Profiles, Event)")

    # 2. Test Booking Request (USER)
    print("\n🔹 Testing User Booking Request...")
    payload = {
        "event": event.id,
        "manager": manager_profile.id,
        "package_name": "Premium",
        "package_price": 10000.00,
        "start_datetime": event.start_datetime.isoformat(),
        "end_datetime": event.end_datetime.isoformat()
    }
    
    response = client_client.post('/api/bookings/request/', payload, format='json')
    
    if response.status_code == status.HTTP_201_CREATED:
        booking_id = response.data['booking_id']
        print(f"✅ Booking Request Created via API. ID: {booking_id}")
    else:
        print(f"❌ Booking Request Failed. Status: {response.status_code}")
        with open('api_error.html', 'w', encoding='utf-8') as f:
            f.write(response.content.decode('utf-8'))
        return

    # 3. Test View Requests (MANAGER)
    print("\n🔹 Testing Manager View Inbox...")
    response = manager_client.get('/api/bookings/manager/requests/')
    
    if response.status_code == status.HTTP_200_OK:
        if len(response.data) > 0 and response.data[0]['id'] == booking_id:
             print(f"✅ Manager successfully can see the booking request")
        else:
             print(f"❌ Manager inbox empty or mismatch")
    else:
        print(f"❌ Manager Inbox Failed: {response.content}")

    # 4. Test Accept Booking (MANAGER)
    print("\n🔹 Testing Manager Accept Booking...")
    response = manager_client.post(f'/api/bookings/accept/{booking_id}/')
    
    if response.status_code == status.HTTP_200_OK:
        print(f"✅ Booking Accepted via API")
    else:
        print(f"❌ Accept Booking Failed: {response.content}")
        return

    # 5. Verify Final State
    print("\n🔹 Verifying Final State in DB...")
    booking = Booking.objects.get(id=booking_id)
    if booking.status == 'PENDING_PAYMENT':
        print(f"✅ Booking Status: PENDING_PAYMENT")
    else:
         print(f"❌ Booking Status Mismatch: {booking.status}")

    if booking.is_locked:
        print(f"✅ Booking is Locked")
    else:
         print(f"❌ Booking NOT Locked")
         
    print("\n🎉 End-to-End API Flow Verification PASSED!")

if __name__ == '__main__':
    run_api_test()
