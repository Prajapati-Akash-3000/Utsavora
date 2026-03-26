from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from .models import User
from .audit import log_action

@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_Managers(request):
    Managers = User.objects.filter(
        role='MANAGER',
        manager_profile__manager_status='PENDING'
    )

    data = []
    for m in Managers:
        data.append({
            "id": m.id,
            "name": m.full_name,
            "email": m.email,
            "company": m.manager_profile.company_name,
            "certificate": m.manager_profile.certificate.url if m.manager_profile.certificate else None,
            "created_at": m.created_at
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_ManagerProfile(request, ManagerProfile_id):
    try:
        user = User.objects.get(id=ManagerProfile_id, role='MANAGER')
        profile = user.manager_profile
        profile.manager_status = 'ACTIVE'
        profile.approved_by = request.user
        profile.approved_at = timezone.now()
        profile.rejection_reason = None
        profile.save()
        log_action("MANAGER_APPROVED", user.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})

        return Response({"message": "Manager approved"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_ManagerProfile(request, ManagerProfile_id):
    reason = request.data.get("reason", "")

    try:
        user = User.objects.get(id=ManagerProfile_id, role='MANAGER')
        profile = user.manager_profile
        profile.manager_status = 'REJECTED'
        profile.rejection_reason = reason
        profile.save()
        log_action("MANAGER_REJECTED", user.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})

        return Response({"message": "Manager rejected"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def block_ManagerProfile(request, ManagerProfile_id):
    try:
        user = User.objects.get(id=ManagerProfile_id, role='MANAGER')
        profile = user.manager_profile
        profile.manager_status = 'BLOCKED'
        profile.save()
        log_action("MANAGER_BLOCKED", user.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})
        return Response({"message": "Manager blocked"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def unblock_ManagerProfile(request, ManagerProfile_id):
    try:
        user = User.objects.get(id=ManagerProfile_id, role='MANAGER')
        profile = user.manager_profile
        profile.manager_status = 'ACTIVE'
        profile.save()
        log_action("MANAGER_UNBLOCKED", user.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})
        return Response({"message": "Manager unblocked"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)
