from rest_framework.views import APIView
from django.utils import timezone
# from rest_framework.response import Response
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
    ManagerUpdateSerializer
)
from .models import ManagerProfile, User, EmailOTP, UserProfile, BankDetails
from django.apps import apps
# from availability.models import BlockedDate
from .permissions import IsApprovedManager, IsActiveManager, IsManager
from rest_framework.response import Response

# ...

@api_view(['GET'])
@permission_classes([IsManager])
def get_manager_availability(request):
    BlockedDate = apps.get_model('availability', 'BlockedDate')
    # Fetch all availability records
    availabilities = BlockedDate.objects.filter(manager=request.user)
    data = []
    
    for av in availabilities:
        title = "Unavailable"
        status_label = "BLOCKED_MANUAL" # Legacy frontend might expect this
        if av.reason == "BOOKED":
            title = "Booked Event"
            status_label = "BOOKED_EVENT"
        
        data.append({
            "id": av.id,
            "date": av.date,
            "status": status_label, 
            "title": title
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([IsManager])
def add_blocked_date(request):
    BlockedDate = apps.get_model('availability', 'BlockedDate')
    date = request.data.get("date")

    if not date:
        return Response(
            {"detail": "Date is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Use update_or_create to handle re-blocking
    BlockedDate.objects.update_or_create(
        manager=request.user,
        date=date,
        defaults={"reason": "HOLIDAY"} # Default manual block to Holiday
    )

    return Response(
        {"detail": "Date blocked successfully."},
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
@permission_classes([IsManager])
def remove_blocked_date(request, id):
    BlockedDate = apps.get_model('availability', 'BlockedDate')
    try:
        blocked = BlockedDate.objects.get(
            id=id,
            manager=request.user
        )
        blocked.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except BlockedDate.DoesNotExist:
        return Response(
            {"detail": "Not found"},
            status=status.HTTP_404_NOT_FOUND
        )
