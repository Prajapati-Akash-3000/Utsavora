from django import forms
from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils import timezone

from .models import (
    AdminProfile,
    AuditLog,
    BankDetails,
    EmailOTP,
    ManagerAvailability,
    ManagerProfile,
    User,
)

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    class UserCreationForm(forms.ModelForm):
        password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
        password2 = forms.CharField(label="Confirm password", widget=forms.PasswordInput)

        class Meta:
            model = User
            fields = ("email", "role", "full_name", "mobile")

        def clean_password2(self):
            password1 = self.cleaned_data.get("password1")
            password2 = self.cleaned_data.get("password2")
            if password1 and password2 and password1 != password2:
                raise forms.ValidationError("Passwords do not match.")
            return password2

        def save(self, commit=True):
            user = super().save(commit=False)
            user.set_password(self.cleaned_data["password1"])
            if commit:
                user.save()
            return user

    class UserChangeForm(forms.ModelForm):
        password = ReadOnlyPasswordHashField(
            help_text="Raw passwords are not stored. Use the password reset flow to change it."
        )

        class Meta:
            model = User
            fields = "__all__"

        def clean_password(self):
            return self.initial["password"]

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = (
        "email",
        "full_name",
        "mobile",
        "role",
        "manager_status",
        "is_verified",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = ("role", "is_verified", "is_active", "is_staff", "is_superuser", "created_at")
    search_fields = ("email", "full_name", "mobile")
    readonly_fields = ("created_at", "last_login")
    ordering = ("-created_at",)
    filter_horizontal = ("groups", "user_permissions")

    fieldsets = (
        ("Login Credentials", {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "mobile", "role")}),
        ("Verification & Access", {"fields": ("is_verified", "is_active", "is_staff", "is_superuser")}),
        ("Permissions", {"fields": ("groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "created_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "role", "full_name", "mobile", "password1", "password2", "is_active", "is_staff"),
            },
        ),
    )

    actions = ["approve_managers", "reject_managers"]

    @admin.display(description="Manager Status")
    def manager_status(self, obj):
        if obj.role != "MANAGER":
            return "-"
        return getattr(getattr(obj, "manager_profile", None), "manager_status", "No Profile")

    @admin.action(description="Approve selected Managers")
    def approve_managers(self, request, queryset):
        admin_profile = getattr(request.user, "admin_profile", None)
        updated = 0
        for user in queryset.filter(role="MANAGER"):
            try:
                if hasattr(user, "manager_profile"):
                    profile = user.manager_profile
                    profile.manager_status = "ACTIVE"
                    profile.approved_at = timezone.now()
                    profile.approved_by = admin_profile
                    profile.save()
                    updated += 1
            except Exception as e:
                self.message_user(request, f"Failed to approve {user.email}: {e}", level=messages.WARNING)

            AuditLog.objects.create(
                user_email=user.email,
                admin=admin_profile,
                action="MANAGER_APPROVED",
                ip_address=request.META.get("REMOTE_ADDR", "127.0.0.1"),
            )
        self.message_user(request, f"{updated} manager(s) approved successfully.")

    @admin.action(description="Reject selected Managers")
    def reject_managers(self, request, queryset):
        admin_profile = getattr(request.user, "admin_profile", None)
        updated = 0
        for user in queryset.filter(role="MANAGER"):
            try:
                if hasattr(user, "manager_profile"):
                    profile = user.manager_profile
                    profile.manager_status = "REJECTED"
                    profile.save()
                    updated += 1
            except Exception as e:
                self.message_user(request, f"Failed to reject {user.email}: {e}", level=messages.WARNING)

            AuditLog.objects.create(
                user_email=user.email,
                admin=admin_profile,
                action="MANAGER_REJECTED",
                ip_address=request.META.get("REMOTE_ADDR", "127.0.0.1"),
            )
        self.message_user(request, f"{updated} manager(s) rejected.")

@admin.register(ManagerProfile)
class ManagerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "user",
        "manager_status",
        "bank_added",
        "approved_by",
        "approved_at",
    )
    list_filter = ("manager_status", "bank_added", "approved_at")
    search_fields = ("user__email", "company_name", "rejection_reason")
    autocomplete_fields = ("user", "approved_by")
    readonly_fields = ("approved_at",)
    list_select_related = ("user", "approved_by")
    fieldsets = (
        ("Manager Account", {"fields": ("user", "company_name", "certificate")}),
        ("Approval", {"fields": ("manager_status", "approved_by", "approved_at", "rejection_reason")}),
        ("Finance", {"fields": ("bank_added",)}),
    )


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "employee_id", "created_at")
    search_fields = ("user__email", "employee_id")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user",)
    list_select_related = ("user",)

@admin.register(BankDetails)
class BankDetailsAdmin(admin.ModelAdmin):
    list_display = ("manager", "account_holder_name", "bank_name", "ifsc_code", "updated_at")
    search_fields = ("manager__user__email", "manager__company_name", "account_holder_name", "ifsc_code")
    readonly_fields = ("updated_at",)
    autocomplete_fields = ("manager",)
    list_select_related = ("manager", "manager__user")

@admin.register(ManagerAvailability)
class ManagerAvailabilityAdmin(admin.ModelAdmin):
    list_display = ("manager", "date", "status", "booking", "created_at")
    list_filter = ("status", "date", "created_at")
    search_fields = ("manager__company_name", "manager__user__email", "booking__event__title")
    autocomplete_fields = ("manager", "booking")
    ordering = ("-date", "-created_at")
    date_hierarchy = "date"
    list_select_related = ("manager", "manager__user", "booking", "booking__event")


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ("user", "otp", "is_used", "created_at", "expires_at")
    list_filter = ("is_used", "created_at", "expires_at")
    search_fields = ("user__email", "otp")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "user_email", "admin", "ip_address", "timestamp")
    list_filter = ("action", "timestamp")
    search_fields = ("user_email", "ip_address", "admin__user__email")
    readonly_fields = ("action", "user_email", "admin", "ip_address", "timestamp", "meta")
    autocomplete_fields = ("admin",)
    ordering = ("-timestamp",)
    date_hierarchy = "timestamp"
    list_select_related = ("admin", "admin__user")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
