from django.contrib import admin
from .models import Package

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ("title", "manager", "category", "price", "is_active", "created_at")
    list_filter = ("is_active", "category", "created_at")
    search_fields = ("title", "description", "manager__company_name", "manager__user__email", "category__name")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("manager", "category")
    ordering = ("-created_at",)
    list_select_related = ("manager", "manager__user", "category")
    date_hierarchy = "created_at"
    fieldsets = (
        ("Package", {"fields": ("manager", "title", "description", "category")}),
        ("Pricing", {"fields": ("price", "is_active")}),
        ("Meta", {"fields": ("created_at",)}),
    )
