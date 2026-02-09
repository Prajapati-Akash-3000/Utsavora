from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import IsVerifiedUser, IsAdminUser
from bookings.models import Booking
from accounts.models import ManagerAvailability
from .models import Payment
from django.db.models import Sum
from django.utils import timezone
from django.conf import settings
import razorpay

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    booking_id = request.data.get("booking_id")
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    if not booking.package:
        return Response({"error": "Booking has no package"}, status=400)
    amount = int(booking.package.price * 100)  # INR -> paise

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
    })

    # Create Payment record for tracking
    Payment.objects.create(
        booking=booking,
        amount=amount / 100,
        transaction_id=order["id"],
        status="PENDING"
    )

    return Response({
        "order_id": order["id"],
        "amount": amount,
        "key": settings.RAZORPAY_KEY_ID,
    })

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def initiate_payment(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user,
            status="PAYMENT_PENDING"
        )
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found or not pending payment"}, status=404)

    # TEMP: replace with package price later. Using fixed 5000 as 50% of 10000.
    amount = 5000.00 

    payment = Payment.objects.create(
        booking=booking,
        amount=amount
    )

    return Response({
        "message": "Payment initiated",
        "amount": amount,
        "payment_id": payment.id
    })

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def confirm_payment(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        payment = Payment.objects.get(booking=booking)
    except (Booking.DoesNotExist, Payment.DoesNotExist):
        return Response({"error": "Booking or Payment not found"}, status=404)

    payment.status = "PAID"
    payment.transaction_id = "TEST_TXN_123"
    payment.save()

    booking.status = "CONFIRMED"
    booking.save()

    return Response({"message": "Booking confirmed"})

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def initiate_fake_payment(request, booking_id):
    booking = Booking.objects.get(id=booking_id)

    if booking.user != request.user:
        return Response({"error": "Unauthorized"}, status=403)

    if booking.status != 'ACCEPTED':
        return Response({"error": "Booking not accepted yet"}, status=400)

    # Use package price if available, else standard 1000 for dummy
    amount = booking.package.price if booking.package else 1000

    # Calculate Fees
    platform_fee = float(amount) * 0.10 # 10%
    manager_amount = float(amount) - platform_fee

    # Create Payment in ESCROW
    payment = Payment.objects.create(
        booking=booking,
        amount=amount,
        platform_fee=platform_fee,
        manager_amount=manager_amount,
        status='ESCROW',
        razorpay_payment_id=f"fake_{timezone.now().timestamp()}" # Fake ID
    )

    booking.payment_status = 'PAID'
    booking.payment_id = payment.razorpay_payment_id
    booking.status = 'CONFIRMED'
    booking.save()

    # Auto-block date
    try:
        ManagerAvailability.objects.create(
            manager=booking.manager,
            date=booking.event.event_date,
            status="BOOKED_EVENT"
        )
    except Exception as e:
        print(f"Error blocking date: {e}")

    # Send Notification Email
    try:
        email_payment_confirmed(booking.user, booking.manager, booking.event, amount)
    except Exception as e:
        print(f"⚠️ Email Error (Fake Payment Confirmation): {e}")

    return Response({
        "message": "Payment successful",
        "payment_id": payment.id
    })



from events.services.email_service import email_payment_confirmed

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def verify_payment(request):
    data = request.data
    
    try:
        # Verify signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"]
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({"error": "Payment verification failed"}, status=400)
    except KeyError:
        return Response({"error": "Missing payment data"}, status=400)

    try:
        payment = Payment.objects.get(transaction_id=data["razorpay_order_id"])
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=404)

    if payment.status != "PENDING":
        return Response({"message": "Payment already processed"})
    
    # Calculate Fees
    total_amount = float(payment.amount)
    platform_fee = total_amount * 0.10 # 10%
    manager_amount = total_amount - platform_fee

    payment.status = "ESCROW" # Hold money
    payment.razorpay_payment_id = data["razorpay_payment_id"]
    payment.platform_fee = platform_fee
    payment.manager_amount = manager_amount
    payment.save()

    booking = payment.booking
    booking.payment_status = "PAID" 
    booking.payment_id = data["razorpay_payment_id"]
    booking.status = "CONFIRMED"
    booking.save()

    # Auto-block date
    try:
        ManagerAvailability.objects.create(
            manager=booking.manager,
            date=booking.event.event_date,
            status="BOOKED_EVENT"
        )
    except Exception as e:
        print(f"Error blocking date: {e}")

    # Send Notification Email
    try:
        email_payment_confirmed(booking.user, booking.manager, booking.event, total_amount)
    except Exception as e:
        print(f"⚠️ Email Error (Payment Confirmation): {e}")

    return Response({"message": "Payment verified successfully"})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_escrow_summary(request): # Renamed from admin_finance_summary for clarity
    total_escrow = Payment.objects.filter(
        status="ESCROW"
    ).aggregate(Sum("manager_amount"))["manager_amount__sum"] or 0

    total_revenue = Payment.objects.aggregate(Sum("platform_fee"))["platform_fee__sum"] or 0

    pending_payouts = Payment.objects.filter(status="ESCROW").count()

    total_volume = Payment.objects.filter(
        status__in=["ESCROW", "RELEASED"]
    ).aggregate(Sum("amount"))["amount__sum"] or 0

    return Response({
        "total_escrow": total_escrow,
        "platform_revenue": total_revenue,
        "pending_payouts": pending_payouts,
        "total_transaction_volume": total_volume,
    })

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_escrow_list(request): # Renamed from admin_transactions
    payments = Payment.objects.select_related(
        "booking", "booking__user", "booking__manager", "booking__event"
    ).order_by("-created_at")

    return Response([
        {
            "id": p.id,
            "event": p.booking.event.title,
            "user": p.booking.user.email,
            "manager": p.booking.manager.email,
            "amount": p.amount,
            "manager_amount": p.manager_amount,
            "status": p.status,
            "date": p.created_at,
        }
        for p in payments
    ])

@api_view(["POST"])
@permission_classes([IsAdminUser])
def release_payment(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id, status="ESCROW")
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found or not in ESCROW"}, status=404)

    # 🔐 Simulated bank transfer
    payment.status = "RELEASED"
    payment.save()

    return Response({"message": "Payment released to manager"})

@api_view(["POST"])
@permission_classes([IsAdminUser])
def refund_payment(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
         return Response({"error": "Payment not found"}, status=404)

    if payment.status == "REFUNDED":
        return Response({"error": "Already refunded"}, status=400)

    payment.status = "REFUNDED"
    payment.save()

    booking = payment.booking
    booking.status = "CANCELLED"
    booking.payment_status = "REFUNDED" # Optional: update if models allow choices update
    booking.save()
    
    # Optional: Remove blocked date 
    # ManagerAvailability.objects.filter(booking=booking).delete()

    return Response({"message": "Refund processed and booking cancelled"})
