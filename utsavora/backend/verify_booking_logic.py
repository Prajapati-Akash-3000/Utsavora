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

def run_test():
    print("🚀 Starting Booking Engine Verification...")

    # 1. Clean up
    User.objects.all().delete()
    print("🧹 Cleaned up old data.")

    # 2. Setup Manager
    manager_user = User.objects.create_user(email='manager@test.com', phone='1234567890', password='password123', role='MANAGER')
    manager_profile = ManagerProfile.objects.create(
        user=manager_user, 
        company_name="Test Events", 
        city="Mumbai", 
        certificate="cert.pdf"
    )
    print(f"✅ Created Manager: {manager_user.email}")

    # 3. Setup Client
    client_user = User.objects.create_user(email='client@test.com', phone='0987654321', password='password123', role='USER')
    client_profile = UserProfile.objects.create(user=client_user, city="Mumbai")
    print(f"✅ Created Client: {client_user.email}")

    # 4. Create Event
    event = Event.objects.create(
        user=client_profile,
        title="Birthday Bash",
        description="Fun times",
        event_type="PRIVATE",
        start_datetime=timezone.now() + timedelta(days=10),
        end_datetime=timezone.now() + timedelta(days=10, hours=4),
        city="Mumbai",
        registration_fee=0
    )
    print(f"✅ Created Event: {event.title}")

    # 5. Create Booking (REQUESTED)
    booking = Booking.objects.create(
        event=event,
        user=client_profile,
        manager=manager_profile,
        package_name="Gold Package",
        package_price=5000.00,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        status='REQUESTED'
    )
    print(f"✅ Created Booking: {booking} [Status: {booking.status}]")

    # 6. Create Conflicting Booking (Same Event, Different Manager - wait, rule is 'exclude(id=self.id).update(status=CANCELLED)' for SAME EVENT)
    # The rule is: "Auto-cancel all other bookings for same event"
    # So if I have another booking request for the SAME EVENT (maybe with a different manager? or same manager?)
    # Usually a client sends requests to multiple managers.
    
    manager2_user = User.objects.create_user(email='manager2@test.com', phone='1122334455', password='password', role='MANAGER')
    manager2_profile = ManagerProfile.objects.create(user=manager2_user, company_name="M2", city="Del")
    
    conflicting_booking = Booking.objects.create(
        event=event,
        user=client_profile,
        manager=manager2_profile,
        package_name="Silver",
        package_price=3000,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        status='REQUESTED'
    )
    print(f"✅ Created Competing Booking: {conflicting_booking} [Status: {conflicting_booking.status}]")

    # 7. Accept Booking (Trigger Logic)
    print("🔄 Accepting Booking 1...")
    booking.accept_booking()
    booking.refresh_from_db()
    conflicting_booking.refresh_from_db()

    # 8. Verifications
    print("\n🔍 Verifying Results:")
    
    # Check Status
    if booking.status == 'PENDING_PAYMENT':
        print(f"✅ Booking 1 Status is PENDING_PAYMENT")
    else:
        print(f"❌ Booking 1 Status Failed: {booking.status}")

    # Check Timer
    if booking.expires_at and booking.expires_at > timezone.now():
         print(f"✅ Payment Timer Started: Expires at {booking.expires_at}")
    else:
         print(f"❌ Payment Timer Failed")

    # Check Availability Block
    availability = ManagerAvailability.objects.filter(booking=booking).first()
    if availability:
        print(f"✅ Availability Block Created for {availability.manager.user.email}")
    else:
        print(f"❌ No Availability Block Created")

    # Check Conflicting Booking (Rule 2)
    if conflicting_booking.status == 'CANCELLED':
        print(f"✅ Conflicting Booking CANCELLED")
    else:
        print(f"❌ Conflicting Booking Failed Check: {conflicting_booking.status}")

    # 9. Test Expiry Logic
    print("\n🔄 Testing Expiry...")
    # Force expiry
    booking.expires_at = timezone.now() - timedelta(minutes=1)
    booking.save()
    
    booking.expire_booking()
    booking.refresh_from_db()
    event.refresh_from_db()
    
    if booking.status == 'EXPIRED':
        print(f"✅ Booking Expired Successfully")
    else:
        print(f"❌ Booking Expiry Failed: {booking.status}")

    if event.status == 'EXPIRED':
         print(f"✅ Event Status Synced to EXPIRED")
    else:
         print(f"❌ Event Status Sync Failed: {event.status}")

    avail_check = ManagerAvailability.objects.filter(booking=booking).exists()
    if not avail_check:
        print(f"✅ Availability Block Released")
    else:
        print(f"❌ Availability Block NOT Released")

if __name__ == '__main__':
    run_test()
