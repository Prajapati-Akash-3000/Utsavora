from django.contrib import admin
from django.utils import timezone
from .models import (
    User,
    UserProfile,
    ManagerProfile,
    BankDetails,
    EmailOTP,
    EmailOTP,
    AuditLog,
    ManagerAvailability
)

class ManagerProfileInline(admin.StackedInline):
    model = ManagerProfile
    can_delete = False
    readonly_fields = ("certificate", "company_name", "city", "bank_added")

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "full_name",
        "role",
        "manager_status",
        "is_verified",
        "is_active",
        "created_at",
    )

    list_filter = ("role", "manager_status", "is_verified")
    search_fields = ("email", "full_name")

    # Expose rejection_reason and other fields for editing
    fields = (
        "email",
        "full_name",
        "role",
        "manager_status",
        "rejection_reason",
        "is_verified",
        "is_active",
        "created_at",
        "approved_at",
        "approved_by",
    )

    readonly_fields = ("created_at", "approved_at", "approved_by")

    inlines = [ManagerProfileInline]

    actions = ["approve_managers", "reject_managers"]

    @admin.action(description="Approve selected managers")
    def approve_managers(self, request, queryset):
        for user in queryset.filter(role="MANAGER"):
            user.manager_status = "ACTIVE"
            user.approved_at = timezone.now()
            user.approved_by = request.user
            user.save()

            AuditLog.objects.create(
                user_email=user.email,
                action="MANAGER_APPROVED",
                ip_address=request.META.get("REMOTE_ADDR", "")
            )

        self.message_user(request, "Selected managers approved successfully")

    @admin.action(description="Reject selected managers")
    def reject_managers(self, request, queryset):
        for user in queryset.filter(role="MANAGER"):
            user.manager_status = "REJECTED"
            user.save()

            AuditLog.objects.create(
                user_email=user.email,
                action="MANAGER_REJECTED",
                ip_address=request.META.get("REMOTE_ADDR", "")
            )

        self.message_user(request, "Selected managers rejected")


# Register remaining models
admin.site.register(UserProfile)
admin.site.register(ManagerProfile)
admin.site.register(BankDetails)
admin.site.register(EmailOTP)
@admin.register(ManagerAvailability)
class ManagerAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('manager', 'date', 'status', 'booking', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('manager__email', 'booking__event__title')

admin.site.register(AuditLog)


