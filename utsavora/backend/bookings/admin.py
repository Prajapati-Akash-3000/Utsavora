from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "event",
        "manager",
        "user",
        "status",
        "payment_status",
        "total_amount",
        "paid_amount",
        "payment_deadline",
        "created_at",
    )
    list_filter = ("status", "payment_status", "created_at", "accepted_at")
    search_fields = (
        "event__title",
        "user__email",
        "manager__user__email",
        "manager__company_name",
        "payment_id",
    )
    readonly_fields = ("created_at", "accepted_at")
    autocomplete_fields = ("event", "package", "user", "manager")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_select_related = ("event", "manager", "manager__user", "user", "package")
    fieldsets = (
        ("Core", {"fields": ("event", "package", "user", "manager")}),
        ("Status", {"fields": ("status", "payment_status", "payment_id", "payment_deadline")}),
        ("Amounts", {"fields": ("total_amount", "paid_amount")}),
        ("Timestamps", {"fields": ("created_at", "accepted_at")}),
    )
