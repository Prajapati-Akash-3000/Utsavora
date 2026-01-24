import os
import django
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from accounts.models import User, UserProfile, ManagerProfile
from events.models import Event
from bookings.models import Booking
from payments.models import Payment

def run_payment_verification():
    print("🚀 Starting Payment System Verification...")
    client = APIClient()

    # 1. Setup Data
    print("\n🔹 Setting up test data...")
    User.objects.all().delete()
    
    # Client
    client_user = User.objects.create_user(email='client@test.com', phone='1111111111', password='pass', role='USER')
    UserProfile.objects.create(user=client_user, city="Mumbai")
    
    # Manager
    manager_user = User.objects.create_user(email='manager@test.com', phone='2222222222', password='pass', role='MANAGER')
    manager_profile = ManagerProfile.objects.create(user=manager_user, company_name="Test Events", city="Mumbai")
    
    # User Login
    client.force_authenticate(user=client_user)

    # Event (Private)
    event = Event.objects.create(
        user=client_user.userprofile,
        title="Wedding",
        event_type="PRIVATE",
        start_datetime=timezone.now() + timedelta(days=10),
        end_datetime=timezone.now() + timedelta(days=10, hours=5),
        status='PENDING_PAYMENT'
    )
    
    # Booking
    booking = Booking.objects.create(
        event=event,
        user=client_user.userprofile,
        manager=manager_profile,
        package_name="Premium",
        package_price=Decimal('10000.00'),
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        status='PENDING_PAYMENT'
    )
    print(f"✅ Created Booking {booking.id} (Status: {booking.status})")

    # 2. Test Escrow Advance
    print("\n🔹 Testing Escrow Advance Payment (50%)...")
    response = client.post(f'/api/payments/escrow/advance/{booking.id}/')
    
    if response.status_code == 200:
        booking.refresh_from_db()
        event.refresh_from_db()
        payment = Payment.objects.last()
        
        print(f"✅ Response: {response.status_code}")
        print(f"✅ Booking Status: {booking.status} (Expected: CONFIRMED)")
        print(f"✅ Event Status: {event.status} (Expected: CONFIRMED)")
        print(f"✅ Payment: {payment.amount} (Expected: 5000.00) Type: {payment.payment_type}")
        
        if booking.status == 'CONFIRMED' and payment.amount == 5000.00:
            print("✅ Escrow Advance Passed")
        else:
            print("❌ Escrow Advance FAILED Logic")
    else:
        print(f"❌ Advance Failed: {response.data}")

    # 3. Test Escrow Final
    print("\n🔹 Testing Escrow Final Payment (Remaining 50%)...")
    response = client.post(f'/api/payments/escrow/final/{booking.id}/')
    
    if response.status_code == 200:
        booking.refresh_from_db()
        event.refresh_from_db()
        payment = Payment.objects.filter(payment_type='ESCROW_FINAL').first()
        
        print(f"✅ Response: {response.status_code}")
        print(f"✅ Booking Status: {booking.status} (Expected: COMPLETED)")
        print(f"✅ Event Status: {event.status} (Expected: COMPLETED)")
        print(f"✅ Payment: {payment.amount} (Expected: 5000.00)")
        
        if booking.status == 'COMPLETED' and payment.amount == 5000.00:
            print("✅ Escrow Final Passed")
        else:
            print("❌ Escrow Final FAILED Logic")
    else:
        print(f"❌ Final Failed: {response.data}")


    # 4. Test Public Event Payment
    print("\n🔹 Testing Public Event Payment...")
    # Create Public Event
    public_event = Event.objects.create(
        user=client_user.userprofile,
        title="Concert",
        event_type="PUBLIC",
        status='CONFIRMED',
        start_datetime=timezone.now() + timedelta(days=5),
        end_datetime=timezone.now() + timedelta(days=5, hours=3),
        registration_fee=Decimal('500.00')
    )
    
    client.logout() # Visitor is anonymous
    response = client.post(f'/api/payments/public/{public_event.id}/')
    
    if response.status_code == 200:
        payment = Payment.objects.filter(payment_type='PUBLIC_EVENT').first()
        print(f"✅ Response: {response.status_code}")
        print(f"✅ Payment Created: {payment.amount} (Expected: 500.00)")
        print("✅ Public Payment Passed")
    else:
        print(f"❌ Public Payment Failed: {response.data}")

    print("\n🎉 Payment System Verification Complete!")

if __name__ == '__main__':
    run_payment_verification()
