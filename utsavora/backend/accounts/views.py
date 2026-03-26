from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (
    UserRegisterSerializer, 
    ManagerRegisterSerializer, 
    ManagerProfileSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    ManagerUpdateSerializer,
    ManagerAvailabilitySerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
)
from .models import User, EmailOTP, ManagerProfile, BankDetails, ManagerAvailability
from .utils import send_otp
from .rate_limit import rate_limit
from .audit import log_action
from .validators import validate_registration_data, validate_email, validate_otp_value
from .permissions import IsApprovedManager, IsActiveManager, IsManager
import random
import traceback
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from django.db.models import Count, Sum, Q

from events.models import Event
from bookings.models import Booking

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        ip = request.META.get("REMOTE_ADDR")
        key = f"register_otp_{ip}"
        if not rate_limit(key, limit=5, timeout=600):
            return Response({"error": "Too many OTP requests. Try later."}, status=429)

        data = request.data.copy() if request.data else {}
        files = request.FILES if request.FILES else {}
        
        validation_errors, cleaned = validate_registration_data(data, files)
        if validation_errors:
            return Response({"errors": validation_errors}, status=400)

        email = cleaned["email"]
        password = cleaned["password"]
        full_name = cleaned["full_name"]
        role = cleaned["role"]
        mobile = cleaned["mobile"]
        company_name = cleaned["company_name"]
        certificate = cleaned["certificate"]


        existing_user = User.objects.filter(email=email).first()
        if existing_user and existing_user.is_active:
            return Response({"errors": {"email": ["An account with this email already exists."]}}, status=400)

        if role == "MANAGER":
            if existing_user:
                existing_user.set_password(password)
                existing_user.role = role
                existing_user.save()
                user = existing_user
                
                ManagerProfile.objects.update_or_create(
                    user=user,
                    defaults={
                        "company_name": company_name or "",
                        "certificate": certificate
                    }
                )
            else:
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    role=role,
                    is_active=False,
                    is_verified=False,
                    full_name=full_name,
                    mobile=mobile
                )
                ManagerProfile.objects.create(
                    user=user,
                    company_name=company_name or "",
                    certificate=certificate,
                    manager_status='PENDING'
                )
        else:
            if existing_user:
                existing_user.set_password(password)
                existing_user.role = role
                existing_user.save()
                user = existing_user
            else:
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    role=role,
                    is_active=False,
                    is_verified=False,
                    full_name=full_name,
                    mobile=mobile
                )
            
            # User profile data is now directly on the User model
            user.full_name = full_name
            user.mobile = mobile

            user.save()

        otp = str(random.randint(100000, 999999))
        EmailOTP.objects.filter(user=user).delete()
        EmailOTP.objects.create(user=user, otp=otp)
        send_otp(email, otp)
        log_action("OTP_SENT", email, ip)

        return Response({"message": "OTP sent", "role": role.lower()})

    except Exception as e:
        print(traceback.format_exc())
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    data = request.data or {}
    email_raw = data.get("email")
    otp_input = data.get("otp")

    errors = {}
    for msg in validate_email(email_raw):
        errors.setdefault("email", []).append(msg)
    for msg in validate_otp_value(otp_input):
        errors.setdefault("otp", []).append(msg)
    if errors:
        return Response({"errors": errors}, status=400)

    email = str(email_raw).strip().lower()
    otp_record = EmailOTP.objects.filter(
        user__email=email,
        otp=str(otp_input).strip(),
        is_used=False
    ).last()

    if not otp_record:
        return Response({"errors": {"otp": ["Invalid OTP."]}}, status=400)

    if otp_record.expires_at < timezone.now():
        return Response({"errors": {"otp": ["OTP has expired. Request a new one."]}}, status=400)

    user = otp_record.user
    user.is_verified = True
    user.is_active = True
    user.save()
    
    otp_record.is_used = True
    otp_record.save()
    log_action("OTP_VERIFIED", email, request.META.get("REMOTE_ADDR"))

    if user.role == "MANAGER":
        return Response({
            "success": True,
            "role": "MANAGER",
            "status": "PENDING_APPROVAL",
            "message": "Registration successful. Your documents are under verification."
        }, status=200)

    return Response({
        "success": True,
        "role": "USER",
        "message": "Registration successful. Please login."
    }, status=200)

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        ip = request.META.get("REMOTE_ADDR")
        key = f"login_{ip}"
        if not rate_limit(key, limit=5, timeout=600):
            return Response({"error": "Too many login attempts"}, status=429)

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            log_action("LOGIN_FAILED", request.data.get("email"), ip, {"error": str(e)})
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user
        if not user.is_verified:
            return Response({"error": "Account not verified"}, status=403)
        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        if user.role == "MANAGER":
            if not hasattr(user, 'manager_profile') or user.manager_profile.manager_status != "ACTIVE":
                return Response({
                    "error": "ACCOUNT_PENDING", 
                    "message": "Your manager account is awaiting admin approval."
                }, status=403)

        log_action("LOGIN_SUCCESS", user.email, ip)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class ManagerProfileSearchView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerProfileSerializer
    
    def get_queryset(self):
        return ManagerProfile.objects.filter(manager_status='ACTIVE')

class ManagerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsApprovedManager]
    
    def get(self, request):
        serializer = ManagerUpdateSerializer(request.user.manager_profile)
        return Response(serializer.data)
        
    def put(self, request):
        serializer = ManagerUpdateSerializer(request.user.manager_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_availability(request):
    if not hasattr(request.user, 'manager_profile'):
        return Response({"error": "Only Managers allowed"})

    manager = request.user.manager_profile
    availabilities = ManagerAvailability.objects.filter(manager=manager).select_related('booking__event', 'booking__user', 'booking__package')
    data = []
    
    for av in availabilities:
        title = "Unavailable"
        event_name = None
        event_id = None
        user_name = None
        user_email = None
        user_mobile = None
        package_name = None
        venue = None
        city = None
        price = None
        start_date = None
        end_date = None
        start_time = None
        end_time = None
        
        if av.status == "BOOKED":
            title = "Booked Event"
            if av.booking and av.booking.event:
                ev = av.booking.event
                event_name = ev.title
                event_id = ev.id
                venue = ev.venue
                city = ev.city
                start_date = ev.start_date
                end_date = ev.end_date
                start_time = ev.start_time.strftime('%H:%M:%S') if ev.start_time else None
                end_time = ev.end_time.strftime('%H:%M:%S') if ev.end_time else None
                
                user_obj = av.booking.user
                if user_obj:
                    user_name = user_obj.full_name or "Unknown"
                    user_email = user_obj.email
                    user_mobile = user_obj.mobile or "No Mobile"
                else:
                    user_name = "Unknown"
                
                if av.booking.package:
                    package_name = av.booking.package.title
                else:
                    package_name = "Custom"
                
                price = av.booking.total_amount

        elif av.status == "BLOCKED":
            title = "Blocked Manually"
        
        data.append({
            "id": av.id,
            "date": av.date,
            "status": av.status,
            "title": title,
            "event_name": event_name,
            "event_id": event_id,
            "user_name": user_name,
            "user_email": user_email,
            "user_mobile": user_mobile,
            "package_name": package_name,
            "venue": venue,
            "city": city,
            "price": price,
            "start_date": start_date,
            "end_date": end_date,
            "start_time": start_time,
            "end_time": end_time,
        })

    return Response(data)

class BlockDateView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
    
    def post(self, request):
        date = request.data.get("date")
        if not date:
            return Response({"detail": "Date is required"}, status=400)

        try:
            ManagerAvailability.objects.create(
                manager=request.user.manager_profile,
                date=date,
                status="BLOCKED"
            )
            return Response({"message": "Date blocked successfully"}, status=201)
        except IntegrityError:
            return Response({"detail": "Date already blocked"}, status=400)

@api_view(['DELETE'])
@permission_classes([IsManager])
def remove_blocked_date(request):
    date = request.data.get("date")
    if not date:
        return Response({"detail": "Date is required"}, status=400)

    deleted_count, _ = ManagerAvailability.objects.filter(
        manager=request.user.manager_profile,
        date=date,
        status="BLOCKED"
    ).delete()

    if deleted_count == 0:
        return Response({"detail": "No manual block found for this date."}, status=404)
        
    return Response({"message": "Date unblocked successfully"})

from payments.models import Payment

class ManagerEarningsView(APIView):
    permission_classes = [IsAuthenticated, IsApprovedManager]

    def get(self, request):
        if not hasattr(request.user, 'manager_profile'):
            return Response({"error": "Only Managers allowed"}, status=403)
            
        manager = request.user.manager_profile
        payments = Payment.objects.filter(booking__manager=manager, status='SUCCESS')
        
        total_earnings = sum(p.manager_amount for p in payments)
        
        recent_transactions = [
            {
                "id": p.id,
                "amount": float(p.manager_amount),
                "date": p.updated_at.isoformat(),
                "event": p.booking.event.title if p.booking and p.booking.event else "Unknown"
            }
            for p in payments.order_by('-updated_at')[:10]
        ]
        
        return Response({
            "total_earnings": float(total_earnings),
            "recent_transactions": recent_transactions
        })


class UserProfileView(APIView):
    """
    User profile (view + edit).
    - View: account details + event analytics (completed/ongoing/category-wise).
    - Edit: full_name and mobile.
    """

    permission_classes = [IsAuthenticated]

    def _build_profile_response(self, request):
        user = request.user

        if user.role != "USER":
            return Response({"detail": "User profile is only available for USER accounts."}, status=403)

        today = timezone.now().date()
        events_qs = Event.objects.filter(created_by=user)

        # "Ongoing" = ACTIVE and not ended by date yet (or date missing).
        ongoing_events_qs = events_qs.filter(
            status="ACTIVE"
        ).filter(Q(end_date__isnull=True) | Q(end_date__gte=today))

        response = {
            "user": UserProfileSerializer(user, context={"request": request}).data,
            "stats": {
                "events": {
                    "total": events_qs.count(),
                    "completed": events_qs.filter(status="COMPLETED").count(),
                    "ongoing": ongoing_events_qs.count(),
                    "cancelled": events_qs.filter(status="CANCELLED").count(),
                },
                "categories": [],
                "bookings": {},
            },
        }

        categories = events_qs.values(
            "category_id",
            "category__name",
            "category__slug",
        ).annotate(
            total=Count("id"),
            completed=Count("id", filter=Q(status="COMPLETED")),
            ongoing=Count("id", filter=Q(status="ACTIVE")),
            cancelled=Count("id", filter=Q(status="CANCELLED")),
        ).order_by("-total")

        response["stats"]["categories"] = [
            {
                "category_id": row["category_id"],
                "name": row["category__name"] or "Uncategorized",
                "slug": row["category__slug"],
                "total": row["total"],
                "completed": row["completed"],
                "ongoing": row["ongoing"],
                "cancelled": row["cancelled"],
            }
            for row in categories
        ]

        bookings_qs = Booking.objects.filter(event__in=events_qs)
        payment_statuses = ["UNPAID", "PARTIALLY_PAID", "FULLY_PAID", "REFUNDED"]

        response["stats"]["bookings"] = {
            "total": bookings_qs.count(),
            "by_status": {
                status: bookings_qs.filter(status=status).count()
                for status in ["PENDING", "ACCEPTED", "REJECTED", "CONFIRMED", "CANCELLED", "COMPLETED"]
            },
            "by_payment_status": {
                ps: bookings_qs.filter(payment_status=ps).count()
                for ps in payment_statuses
            },
            "total_paid_amount": float(bookings_qs.aggregate(total=Sum("paid_amount"))["total"] or 0),
        }

        return response

    def get(self, request):
        resp = self._build_profile_response(request)
        if isinstance(resp, Response):
            return resp
        return Response(resp)

    def put(self, request):
        user = request.user

        if user.role != "USER":
            return Response({"detail": "User profile is only available for USER accounts."}, status=403)

        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        resp = self._build_profile_response(request)
        return Response(resp)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    Step 1: User requests password reset.
    Find user, generate OTP, save to EmailOTP, and email.
    """
    data = request.data or {}
    email_raw = data.get("email")

    if not email_raw:
        return Response({"error": "Email is required."}, status=400)
        
    email = str(email_raw).strip().lower()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Avoid user enum: return success message anyway
        return Response({"error": "If this email exists, an OTP has been sent."}, status=404)

    # 1. Generate new OTP
    otp = str(random.randint(100000, 999999))

    # 2. Invalidate previous unexpired OTPs
    EmailOTP.objects.filter(user=user).delete()

    # 3. Create fresh OTP
    EmailOTP.objects.create(user=user, otp=otp)

    # 4. Send email
    try:
        send_otp(email, otp)
    except Exception as e:
        print("Failed to send OTP:", e)
        return Response({"error": "Could not send OTP email. Please try again later."}, status=500)

    # 5. Log activity
    ip = request.META.get("REMOTE_ADDR")
    log_action("OTP_SENT", email, ip)

    return Response({"message": "OTP sent to email"})

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    """
    Step 2: User provides OTP to prove ownership.
    """
    data = request.data or {}
    email_raw = data.get("email")
    otp_input = data.get("otp")

    if not email_raw or not otp_input:
        return Response({"error": "Email and OTP are required."}, status=400)

    email = str(email_raw).strip().lower()
    otp_input = str(otp_input).strip()

    otp_record = EmailOTP.objects.filter(
        user__email=email,
        otp=otp_input,
        is_used=False
    ).last()

    if not otp_record:
        return Response({"error": "Invalid or expired OTP."}, status=400)

    if otp_record.is_expired():
        return Response({"error": "OTP has expired. Request a new one."}, status=400)

    # Valid OTP found! Keep it unused for step 3.
    return Response({"message": "OTP verified successfully."})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Step 3: User resets password by providing Email, OTP, and new Password.
    """
    data = request.data or {}
    email_raw = data.get("email")
    otp_input = data.get("otp")
    new_password = data.get("password")

    if not email_raw or not otp_input or not new_password:
        return Response({"error": "Email, OTP, and new password are required."}, status=400)

    if len(new_password) < 8:
        return Response({"error": "Password must be at least 8 characters."}, status=400)

    email = str(email_raw).strip().lower()
    otp_input = str(otp_input).strip()

    otp_record = EmailOTP.objects.filter(
        user__email=email,
        otp=otp_input,
        is_used=False
    ).last()

    if not otp_record or otp_record.is_expired():
        return Response({"error": "Invalid or expired OTP. Please restart password reset."}, status=400)

    user = otp_record.user
    user.set_password(new_password)
    user.save()

    # Mark OTP as used to prevent replay
    otp_record.is_used = True
    otp_record.save()
    
    ip = request.META.get("REMOTE_ADDR")
    log_action("PASSWORD_RESET", email, ip)

    return Response({"message": "Password reset successful. You can now login."})
