from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "booking",
        "amount",
        "platform_fee",
        "manager_amount",
        "payment_type",
        "status",
        "created_at",
    )
    list_filter = ("status", "payment_type", "created_at")
    search_fields = (
        "booking__event__title",
        "booking__user__email",
        "razorpay_order_id",
        "razorpay_payment_id",
        "transaction_id",
    )
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("booking",)
    ordering = ("-created_at",)
    list_select_related = ("booking", "booking__event", "booking__user")
    date_hierarchy = "created_at"
    fieldsets = (
        ("Booking Link", {"fields": ("booking", "payment_type", "status")}),
        ("Gateway", {"fields": ("razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "transaction_id")}),
        ("Settlement", {"fields": ("amount", "platform_fee", "manager_amount")}),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )
