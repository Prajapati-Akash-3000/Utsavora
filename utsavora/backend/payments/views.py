from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from accounts.permissions import IsVerifiedUser, IsAdminUser
from bookings.models import Booking
from .models import Payment
from django.db.models import Sum

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

# RAZORPAY INTEGRATION

import razorpay
from django.conf import settings

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def create_payment_order(request, booking_id):
    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user,
            status="PAYMENT_PENDING"
        )
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found or not pending payment"}, status=404)

    # Use actual amount logic here if available, else 50% of 10000
    total_amount = 10000 
    advance_amount = int(total_amount * 0.5 * 100)  # in paise

    data = {
        "amount": advance_amount,
        "currency": "INR",
        "payment_capture": 1
    }
    
    try:
      razorpay_order = client.order.create(data)
    except Exception as e:
      return Response({"error": f"Razorpay Error: {str(e)}"}, status=500)

    # Create Payment record as PENDING
    Payment.objects.create(
        booking=booking,
        amount=advance_amount / 100, # store in rupees
        platform_fee=advance_amount * 0.05 / 100, # 5% fee
        manager_amount=advance_amount * 0.95 / 100, # 95% to manager
        transaction_id=razorpay_order["id"],
        status="PENDING"
    )

    return Response({
        "order_id": razorpay_order["id"],
        "razorpay_key": settings.RAZORPAY_KEY_ID,
        "amount": advance_amount,
        "currency": "INR",
        "booking_id": booking.id
    })

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
    except Exception as e:
        return Response({"error": "Payment verification failed"}, status=400)

    try:
        payment = Payment.objects.get(transaction_id=data["razorpay_order_id"])
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=404)

    if payment.status == "PAID":
        return Response({"message": "Payment already processed"})

    payment.status = "PAID"
    payment.save()

    booking = payment.booking
    booking.status = "CONFIRMED"
    booking.save()

    return Response({"message": "Payment successful"})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_finance_summary(request):
    total_volume = Payment.objects.filter(
        status__in=["PAID", "RELEASED"]
    ).aggregate(Sum("amount"))["amount__sum"] or 0

    platform_revenue = Payment.objects.filter(
        status__in=["PAID", "RELEASED"]
    ).aggregate(Sum("platform_fee"))["platform_fee__sum"] or 0

    escrow_balance = Payment.objects.filter(
        status="PAID"
    ).aggregate(Sum("manager_amount"))["manager_amount__sum"] or 0

    return Response({
        "total_transaction_volume": total_volume,
        "platform_revenue": platform_revenue,
        "escrow_balance": escrow_balance,
    })

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_transactions(request):
    payments = Payment.objects.select_related(
        "booking", "booking__user", "booking__manager"
    ).order_by("-created_at")

    return Response([
        {
            "payment_id": p.id,
            "event": p.booking.event.title,
            "user": p.booking.user.email,
            "manager": p.booking.manager.email,
            "amount": p.amount,
            "platform_fee": p.platform_fee,
            "manager_amount": p.manager_amount,
            "status": p.status,
            "created_at": p.created_at,
        }
        for p in payments
    ])

@api_view(["POST"])
@permission_classes([IsAdminUser])
def release_payment(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id, status="PAID")
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found or not in PAID state"}, status=404)

    # 🔐 Here later: actual bank transfer API
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

    if payment.status not in ["PAID", "PENDING"]:
        return Response({"error": "Refund not allowed for this status"}, status=400)

    payment.status = "REFUNDED"
    payment.save()

    booking = payment.booking
    booking.status = "CANCELLED"
    booking.save()

    return Response({"message": "Refund initiated and booking cancelled"})
