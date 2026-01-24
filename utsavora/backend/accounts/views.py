from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .serializers import (
    UserRegisterSerializer, 
    ManagerRegisterSerializer, 
    ManagerProfileSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    ManagerUpdateSerializer,
    ManagerAvailabilitySerializer
)
from .models import ManagerProfile, User, EmailOTP, UserProfile, BankDetails, ManagerAvailability
from .utils import send_otp
from .rate_limit import rate_limit
from .audit import log_action
from .permissions import IsApprovedManager, IsActiveManager, IsManager
import random
import traceback
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError

@api_view(["POST"])
def user_login(request):
    # Deprecated/Custom login logic if needed, but LoginView is primary
    pass 

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        ip = request.META.get("REMOTE_ADDR")
        key = f"register_otp_{ip}"

        if not rate_limit(key, limit=5, timeout=600):
            return Response({"error": "Too many OTP requests. Try later."}, status=429)

        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        role = data.get('role', 'USER')
        phone = data.get('mobile')
        company_name = data.get('company_name')
        city = data.get('city', '')

        if not all([email, password, full_name, role]):
            return Response({"error": "All fields are required"}, status=400)
        
        role = role.upper()
        if role not in ["USER", "MANAGER"]:
            return Response({"error": "Invalid role"}, status=400)

        existing_user = User.objects.filter(email=email).first()
        
        if existing_user:
            if existing_user.is_active:
               return Response({"error": "Email already exists"}, status=400)
            else:
               existing_user.set_password(password)
               existing_user.full_name = full_name
               existing_user.role = role
               existing_user.mobile = phone
               existing_user.save()
               user = existing_user
        else:
            user = User.objects.create_user(
                email=email,
                password=password,
                full_name=full_name,
                role=role,
                mobile=phone,
                is_active=False,
                is_verified=False
            )
        
        if role == "MANAGER":
            # Update User specific fields
            user.company_name = company_name or ""
            if request.FILES.get('certificate'):
                user.certificate = request.FILES.get('certificate')
            user.save()

            if not ManagerProfile.objects.filter(user=user).exists():
                 ManagerProfile.objects.create(
                     user=user, 
                     company_name=company_name or "", 
                     city=city, 
                     certificate=request.FILES.get('certificate')
                 )
        else:
            # Explicitly set active status for Users since they don't need approval
            user.manager_status = 'ACTIVE'
            user.save() 
            
            if not UserProfile.objects.filter(user=user).exists():
                UserProfile.objects.create(user=user, city=city)

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
    email = request.data.get('email')
    otp_input = request.data.get('otp')

    if not email or not otp_input:
        return Response({"error": "Email and OTP are required"}, status=400)
    
    otp_record = EmailOTP.objects.filter(
        user__email=email, 
        otp=str(otp_input).strip(),
        is_used=False
    ).last()

    if not otp_record:
        return Response({"error": "Invalid OTP"}, status=400)

    if otp_record.expires_at < timezone.now():
        return Response({"error": "OTP expired"}, status=400)

    user = otp_record.user
    user.is_verified = True
    user.is_active = True
    
    if user.role == 'MANAGER':
        user.manager_status = 'PENDING'
        user.save()
        otp_record.is_used = True
        otp_record.save()
        log_action("OTP_VERIFIED", email, request.META.get("REMOTE_ADDR"))
        return Response({"message": "Document verification pending", "role": "MANAGER", "login": False}, status=200)

    # User flow: Auto-active? Users don't use manager_status.
    # user.is_approved = True # Removed
    user.save()
    otp_record.is_used = True
    otp_record.save()
    log_action("OTP_VERIFIED", email, request.META.get("REMOTE_ADDR"))

    return Response({"message": "Registration successful. Please login.", "role": "USER"}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    ip = request.META.get("REMOTE_ADDR")
    key = f"resend_otp_{ip}"
    if not rate_limit(key, limit=3, timeout=600):
        return Response({"error": "OTP resend limit reached"}, status=429)

    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
        EmailOTP.objects.filter(user=user).delete()
        otp = str(random.randint(100000, 999999))
        EmailOTP.objects.create(user=user, otp=otp)
        send_otp(email, otp)
        log_action("OTP_SENT", email, ip, {"type": "resend"})
        return Response({"message": "OTP resent successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    from datetime import timedelta
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Email not registered"}, status=400)

    otp = str(random.randint(100000, 999999))
    EmailOTP.objects.create(user=user, otp=otp, expires_at=timezone.now() + timedelta(minutes=5))
    send_otp(email, otp)
    return Response({"message": "OTP sent to email"})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    new_password = request.data.get("password")
    try:
        user = User.objects.get(email=email)
        otp_record = EmailOTP.objects.filter(user=user, otp=otp).last()
        if not otp_record: return Response({"error": "Invalid OTP"}, status=400)
        if otp_record.expires_at < timezone.now(): return Response({"error": "OTP expired"}, status=400)
        user.set_password(new_password)
        user.save()
        otp_record.delete()
        return Response({"message": "Password reset successful"})
    except Exception as e:
        return Response({"error": "Invalid OTP or User"}, status=400)

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
        # USER login
        if user.role == "USER":
            if not user.is_verified:
                return Response({"error": "Account not verified"}, status=403)
            if not user.is_active:
                return Response({"error": "Account is disabled"}, status=403)

        # MANAGER login
        elif user.role == "MANAGER":
            if not user.is_verified:
                return Response({"error": "Email not verified"}, status=403)

            if user.manager_status != "ACTIVE":
                return Response({"error": "Manager approval pending or rejected"}, status=403)

        # ADMIN login
        elif user.role == "ADMIN":
            pass  # allow

        log_action("LOGIN_SUCCESS", user.email, ip)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class ManagerSearchView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerProfileSerializer
    def get_queryset(self):
        city = self.request.query_params.get('city')
        queryset = ManagerProfile.objects.filter(status='APPROVED')
        if city: queryset = queryset.filter(city__icontains=city)
        return queryset

from .permissions import IsApprovedManager, IsActiveManager

# ... [Keep existing code] ...

class ManagerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsApprovedManager]
    def get(self, request):
        serializer = ManagerUpdateSerializer(request.user.managerprofile)
        return Response(serializer.data)
    def put(self, request):
        serializer = ManagerUpdateSerializer(request.user.managerprofile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsActiveManager])
def add_or_update_bank_details(request):
    try:
        manager_profile = ManagerProfile.objects.get(user=request.user)
    except ManagerProfile.DoesNotExist:
         return Response({"error": "Manager profile not found"}, status=404)

    BankDetails.objects.update_or_create(
        manager=manager_profile,
        defaults={
            "account_holder_name": request.data.get("account_holder_name"),
            "account_number": request.data.get("account_number"),
            "ifsc_code": request.data.get("ifsc_code"),
            "bank_name": request.data.get("bank_name"),
        }
    )

    # Mark bank as added
    manager_profile.bank_added = True
    manager_profile.save()

    return Response({
        "message": "Bank details saved successfully",
        "bank_added": True
    })

@api_view(['GET'])
@permission_classes([IsManager])
def get_manager_availability(request):
    # 1. Manual Blocks
    blocked_query = ManagerAvailability.objects.filter(manager=request.user)
    data = []
    
    for block in blocked_query:
        data.append({
            "id": block.id,
            "date": block.date,
            "type": "BLOCKED",
            "title": "Unavailable"
        })

    # 2. Confirmed Bookings
    # Import inside to avoid circular dependency
    from bookings.models import Booking
    
    # We include ACCEPTED/PAYMENT_PENDING/CONFIRMED to ensure visual coverage
    # or strictly CONFIRMED if that's the only "Green" state. 
    # User said "status = CONFIRMED". Let's stick to that for Green.
    # But for safety, maybe all active bookings should be shown? 
    # Attempting to stick to user request: "Booked Dates... Condition: status = CONFIRMED"
    bookings = Booking.objects.filter(
        manager=request.user, 
        status="CONFIRMED"
    ).select_related('event')

    for b in bookings:
        data.append({
            "id": b.id,
            "date": b.event.event_date,
            "type": "BOOKED",
            "title": b.event.title
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([IsManager])
def add_blocked_date(request):
    date = request.data.get("date")

    if not date:
        return Response(
            {"detail": "Date is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        ManagerAvailability.objects.create(
            manager=request.user,
            date=date
        )
    except IntegrityError:
        return Response(
            {"detail": "This date is already blocked."},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {"detail": "Date blocked successfully."},
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
@permission_classes([IsManager])
def remove_blocked_date(request, id):
    try:
        blocked = ManagerAvailability.objects.get(
            id=id,
            manager=request.user
        )
        blocked.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ManagerAvailability.DoesNotExist:
        return Response(
            {"detail": "Not found"},
            status=status.HTTP_404_NOT_FOUND
        )
