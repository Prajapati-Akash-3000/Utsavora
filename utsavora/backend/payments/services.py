from datetime import date, timedelta
from payments.models import Payment

def auto_release_payments():
    today = date.today()
    # Logic: Release if event date has passed (yesterday or earlier)
    # 24h buffer: if event was yesterday, today we can release.
    release_date_threshold = today - timedelta(days=1) 
    
    print(f"Checking for payments to release... (Event Date <= {release_date_threshold})")

    # Find ESCROW payments for CONFIRMED bookings where event date has passed
    payments = Payment.objects.filter(
        status='ESCROW',
        booking__status='CONFIRMED', # Paying confirmed bookings
        booking__event__start_date__lte=release_date_threshold
    )
    
    count = 0
    for payment in payments:
        print(f"Releasing Payment {payment.id} for Booking {payment.booking.id} (Event: {payment.booking.event.title})")
        
        # 1. Update Payment
        payment.status = 'RELEASED'
        payment.save()

        # 2. Update Booking
        payment.booking.status = 'COMPLETED'
        payment.booking.save()
        
        count += 1

    print(f"Released {count} payments.")
    return count
