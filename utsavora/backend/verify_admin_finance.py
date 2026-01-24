import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from payments.models import Payment
from bookings.models import Booking
from events.models import Event

User = get_user_model()

def setup_data():
    # Create Admin
    admin_email = "admin_test@example.com"
    if not User.objects.filter(email=admin_email).exists():
        admin = User.objects.create_superuser(email=admin_email, password="password123", full_name="Admin Test", role="ADMIN")
    else:
        admin = User.objects.get(email=admin_email)

    # Create Manager/User/Event/Booking for testing
    manager_email = "manager_test@example.com"
    if not User.objects.filter(email=manager_email).exists():
        manager = User.objects.create_user(email=manager_email, password="password123", full_name="Manager Test", role="MANAGER")
    else:
        manager = User.objects.get(email=manager_email)

    user_email = "user_test@example.com"
    if not User.objects.filter(email=user_email).exists():
        user = User.objects.create_user(email=user_email, password="password123", full_name="User Test", role="USER")
    else:
        user = User.objects.get(email=user_email)

    if not Event.objects.filter(title="Test Event").exists():
        event = Event.objects.create(user=manager, title="Test Event", description="Desc", city="Test City", event_date="2025-12-31")
    else:
        event = Event.objects.filter(title="Test Event").first()

    booking = Booking.objects.create(event=event, user=user, manager=manager, status="CONFIRMED")
    
    # Create Payment
    payment = Payment.objects.create(
        booking=booking,
        amount=5000.00,
        platform_fee=500.00,
        manager_amount=4500.00,
        status="PAID"
    )
    return admin, payment

def test_admin_finance():
    admin, payment = setup_data()
    client = APIClient()
    client.force_authenticate(user=admin)

    print("--- Testing Finance Summary ---")
    response = client.get('/api/payments/admin/summary/')
    print(f"Status: {response.status_code}")
    print(f"Data: {response.data}")
    
    if response.status_code == 200:
        print("✅ Finance Summary Access OK")
    else:
        print("❌ Finance Summary Failed")

    print("\n--- Testing Transactions Log ---")
    response = client.get('/api/payments/admin/transactions/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200 and len(response.data) > 0:
        print("✅ Transactions Log OK")
    else:
        print(f"❌ Transactions Log Failed or Empty {response.data}")

    print("\n--- Testing Release Payment ---")
    response = client.post(f'/api/payments/admin/{payment.id}/release/')
    print(f"Status: {response.status_code}")
    
    payment.refresh_from_db()
    if payment.status == "RELEASED":
        print("✅ Payment Released OK")
    else:
        print(f"❌ Payment Release Failed. Status: {payment.status}")

    print("\n--- Testing Refund Payment (New Payment) ---")
    # New payment for refund
    booking_refund = Booking.objects.create(event=payment.booking.event, user=payment.booking.user, manager=payment.booking.manager, status="PAYMENT_PENDING")
    payment_refund = Payment.objects.create(booking=booking_refund, amount=5000, status="PAID")
    
    response = client.post(f'/api/payments/admin/{payment_refund.id}/refund/')
    print(f"Status: {response.status_code}")
    
    payment_refund.refresh_from_db()
    booking_refund.refresh_from_db()
    
    if payment_refund.status == "REFUNDED" and booking_refund.status == "CANCELLED":
        print("✅ Payment Refunded & Booking Cancelled OK")
    else:
        print(f"❌ Refund Failed. PaymentStatus: {payment_refund.status}, BookingStatus: {booking_refund.status}")

if __name__ == "__main__":
    test_admin_finance()
