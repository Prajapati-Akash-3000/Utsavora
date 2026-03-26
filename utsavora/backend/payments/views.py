from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.permissions import IsVerifiedUser, IsAdminUser
from bookings.models import Booking
from accounts.models import ManagerAvailability
from .models import Payment
from .serializers import PaymentSerializer
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

    if not booking.total_amount:
        return Response({"error": "Booking has no price set"}, status=400)
    amount = int(booking.total_amount * 100)  # INR -> paise

    payment = Payment.objects.filter(booking=booking).first()
    if payment and payment.status != "PENDING":
        return Response({"error": "Payment already processed"}, status=400)

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
    })

    Payment.objects.update_or_create(
        booking=booking,
        defaults={
            "amount": amount / 100,
            "razorpay_order_id": order["id"],
            "transaction_id": order["id"],
            "status": "PENDING",
            "payment_type": "ADVANCE" if booking.payment_status == "UNPAID" else "FINAL"
        }
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

    amount = booking.total_amount

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
    payment.save()

    booking.status = "CONFIRMED"
    booking.payment_status = "FULLY_PAID"
    booking.save()

    return Response({"message": "Booking confirmed"})

@api_view(["POST"])
@permission_classes([IsVerifiedUser])
def verify_payment(request):
    data = request.data
    try:
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
    
    total_amount = float(payment.amount)
    platform_fee = total_amount * 0.10
    manager_amount = total_amount - platform_fee

    payment.status = "ESCROW"
    payment.razorpay_payment_id = data["razorpay_payment_id"]
    payment.platform_fee = platform_fee
    payment.manager_amount = manager_amount
    payment.save()

    booking = payment.booking
    booking.payment_status = "FULLY_PAID" 
    booking.payment_id = data["razorpay_payment_id"]
    booking.status = "CONFIRMED"
    booking.save()

    # Block calendar
    try:
        event = booking.event
        start = event.start_date
        end = event.end_date or event.start_date
        if start and end:
            from datetime import timedelta
            curr = start
            while curr <= end:
                ManagerAvailability.objects.get_or_create(
                    manager=booking.manager,
                    date=curr,
                    defaults={"status": "BOOKED", "booking": booking}
                )
                curr += timedelta(days=1)
    except Exception as e:
        print(f"Error blocking dates: {e}")

    return Response({"message": "Payment verified successfully"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_payouts(request):
    if hasattr(request.user, 'manager_profile'):
        payments = Payment.objects.filter(booking__manager=request.user.manager_profile, status="ESCROW")
        total_payout = payments.aggregate(Sum('manager_amount'))['manager_amount__sum'] or 0
        return Response({
            "payments": PaymentSerializer(payments, many=True).data,
            "total_payout": total_payout
        })
    return Response({"error": "Manager profile not found"}, status=404)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_list_all_payments(request):
    payments = Payment.objects.all().order_by("-created_at")
    return Response(PaymentSerializer(payments, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_fake_payment(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    booking.payment_status = "FULLY_PAID"
    booking.status = "CONFIRMED"
    booking.save()
    return Response({"message": "Fake payment successful"})

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_escrow_summary(request):
    data = Payment.objects.aggregate(
        total_escrow=Sum('amount'),
        total_fees=Sum('platform_fee'),
        total_manager=Sum('manager_amount')
    )
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_escrow_list(request):
    payments = Payment.objects.filter(status="ESCROW")
    return Response(PaymentSerializer(payments, many=True).data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def release_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id, status="ESCROW")
    payment.status = "PAID"
    payment.save()
    return Response({"message": "Payment released to manager"})

@api_view(["POST"])
@permission_classes([IsAdminUser])
def refund_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id, status="ESCROW")
    payment.status = "REFUNDED"
    payment.save()
    booking = payment.booking
    booking.payment_status = "REFUNDED"
    booking.save()
    return Response({"message": "Payment refunded to user"})
