import os
import django
from django.utils import timezone
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User, UserProfile, ManagerProfile
from events.models import Event
from bookings.models import Booking, ManagerAvailability
from bookings.tasks import expire_bookings

def run_expiry_test():
    print("🚀 Starting Expiry Logic Verification...")
    
    # 1. Setup Data
    User.objects.all().delete()
    
    client_user = User.objects.create_user(email='client@test.com', phone='1234567890', password='password123', role='USER')
    UserProfile.objects.create(user=client_user, city="Mumbai")
    
    manager_user = User.objects.create_user(email='manager@test.com', phone='0987654321', password='password123', role='MANAGER')
    manager_profile = ManagerProfile.objects.create(user=manager_user, company_name="Test Events", city="Mumbai", certificate="cert.pdf")
    
    event = Event.objects.create(
        user=client_user.userprofile,
        title="Wedding",
        description="Big fat wedding",
        event_type="PRIVATE",
        start_datetime=timezone.now() + timedelta(days=20),
        end_datetime=timezone.now() + timedelta(days=20, hours=6),
        city="Mumbai",
        status='PENDING_PAYMENT'
    )
    
    # Create an EXPIRED booking (simulated)
    # Accepted 11 hours ago, so it should be expired (expiry is 10 hours)
    past_time = timezone.now() - timedelta(hours=11)
    
    booking = Booking.objects.create(
        event=event,
        user=client_user.userprofile,
        manager=manager_profile,
        package_name="Premium",
        package_price=10000.00,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        status='PENDING_PAYMENT',
        accepted_at=past_time,
        expires_at=past_time + timedelta(hours=10), # Expired 1 hour ago
        is_locked=True
    )

    # Create Availability Block (that should be deleted)
    ManagerAvailability.objects.create(
        manager=manager_profile,
        start_datetime=booking.start_datetime,
        end_datetime=booking.end_datetime,
        source='BOOKING',
        booking=booking
    )
    
    print(f"✅ Setup: Booking {booking.id} Created. Status: {booking.status}. Expires At: {booking.expires_at}")

    # 2. Run Expiry Task
    print("\n⏳ Running expire_bookings() task...")
    expire_bookings()
    
    # 3. Verify Final State
    booking.refresh_from_db()
    event.refresh_from_db()
    
    print("\n🔹 Verifying Results...")
    
    # Check Booking Status
    if booking.status == 'EXPIRED':
        print("✅ Booking Status: EXPIRED")
    else:
        print(f"❌ Booking Status Mismatch: {booking.status}")

    # Check Event Status
    if event.status == 'EXPIRED':
        print("✅ Event Status: EXPIRED")
    else:
        print(f"❌ Event Status Mismatch: {event.status}")
        
    # Check Availability Released
    availability_exists = ManagerAvailability.objects.filter(booking=booking).exists()
    if not availability_exists:
        print("✅ Manager Availability Released (Deleted)")
    else:
         print("❌ Manager Availability STILL EXISTS")

    if booking.status == 'EXPIRED' and not availability_exists:
        print("\n🎉 Expiry Logic Verification PASSED!")
    else:
        print("\n❌ Verification FAILED")

if __name__ == '__main__':
    run_expiry_test()
