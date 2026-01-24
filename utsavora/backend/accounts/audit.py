from .models import AuditLog

def log_action(action, email, ip, meta=None):
    AuditLog.objects.create(
        action=action,
        user_email=email,
        ip_address=ip,
        meta=meta
    )
