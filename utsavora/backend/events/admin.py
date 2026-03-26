from django.contrib import admin

from .models import Event, EventCategory, EventMedia, InvitationTemplate, PublicEventRegistration


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    ordering = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(InvitationTemplate)
class InvitationTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "template_key", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "template_key")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("category",)
    ordering = ("-created_at",)
    list_select_related = ("category",)
    fieldsets = (
        ("Template Identity", {"fields": ("name", "template_key", "category", "is_active")}),
        ("Template Content", {"fields": ("preview_image", "html_content")}),
        ("Meta", {"fields": ("created_at",)}),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_by",
        "category",
        "visibility",
        "pricing_type",
        "registration_fee",
        "city",
        "start_date",
        "end_date",
        "status",
        "created_at",
    )
    list_filter = ("status", "visibility", "pricing_type", "category", "start_date", "created_at")
    search_fields = ("title", "description", "city", "venue", "created_by__email")
    readonly_fields = ("created_at", "updated_at", "media_upload_deadline")
    autocomplete_fields = ("created_by", "category", "template")
    ordering = ("-created_at",)
    date_hierarchy = "start_date"
    list_select_related = ("created_by", "category", "template")
    fieldsets = (
        ("Event Basics", {"fields": ("created_by", "title", "description", "category", "template")}),
        ("Schedule", {"fields": ("start_date", "start_time", "end_date", "end_time", "media_upload_deadline")}),
        ("Venue", {"fields": ("venue", "city", "contact_numbers")}),
        ("Public Settings", {"fields": ("visibility", "pricing_type", "registration_fee")}),
        ("Invitation Data", {"fields": ("invitation_data", "invitation_pdf")}),
        ("Lifecycle", {"fields": ("status", "created_at", "updated_at")}),
    )


@admin.register(EventMedia)
class EventMediaAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "uploaded_by", "created_at")
    list_filter = ("created_at",)
    search_fields = ("event__title", "uploaded_by__email")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("event", "uploaded_by")
    ordering = ("-created_at",)
    list_select_related = ("event", "uploaded_by")
    date_hierarchy = "created_at"


@admin.register(PublicEventRegistration)
class PublicEventRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "event",
        "full_name",
        "email",
        "mobile",
        "status",
        "payment_status",
        "amount_paid",
        "created_at",
    )
    list_filter = ("status", "payment_status", "created_at")
    search_fields = ("event__title", "full_name", "email", "mobile", "razorpay_order_id", "razorpay_payment_id")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("event",)
    ordering = ("-created_at",)
    list_select_related = ("event",)
    date_hierarchy = "created_at"
    fieldsets = (
        ("Attendee", {"fields": ("event", "full_name", "email", "mobile")}),
        ("Payment", {"fields": ("status", "payment_status", "amount_paid", "razorpay_order_id", "razorpay_payment_id")}),
        ("Meta", {"fields": ("created_at",)}),
    )
