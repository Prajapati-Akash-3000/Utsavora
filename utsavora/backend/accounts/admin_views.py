from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from .models import User
from .audit import log_action

@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_managers(request):
    managers = User.objects.filter(
        role='MANAGER',
        manager_status='PENDING'
    )

    data = []
    for m in managers:
        data.append({
            "id": m.id,
            "name": m.full_name,
            "email": m.email,
            "company": m.company_name,
            "certificate": m.certificate.url if m.certificate else None,
            "created_at": m.created_at
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_manager(request, manager_id):
    try:
        manager = User.objects.get(id=manager_id, role='MANAGER')
        manager.manager_status = 'ACTIVE'
        manager.approved_by = request.user
        manager.approved_at = timezone.now()
        manager.rejection_reason = None
        manager.save()
        log_action("MANAGER_APPROVED", manager.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})

        return Response({"message": "Manager approved"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_manager(request, manager_id):
    reason = request.data.get("reason", "")

    try:
        manager = User.objects.get(id=manager_id, role='MANAGER')
        manager.manager_status = 'REJECTED'
        manager.rejection_reason = reason
        manager.save()
        log_action("MANAGER_REJECTED", manager.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})

        return Response({"message": "Manager rejected"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def block_manager(request, manager_id):
    try:
        manager = User.objects.get(id=manager_id, role='MANAGER')
        manager.manager_status = 'BLOCKED'
        manager.save()
        log_action("MANAGER_BLOCKED", manager.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})
        return Response({"message": "Manager blocked"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def unblock_manager(request, manager_id):
    try:
        manager = User.objects.get(id=manager_id, role='MANAGER')
        manager.manager_status = 'ACTIVE'
        manager.save()
        log_action("MANAGER_UNBLOCKED", manager.email, request.META.get("REMOTE_ADDR"), {"admin_user": request.user.email})
        return Response({"message": "Manager unblocked"})
    except User.DoesNotExist:
        return Response({"error": "Manager not found"}, status=404)
