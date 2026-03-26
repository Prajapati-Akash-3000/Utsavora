from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "rating", "created_at")
    list_filter = ("role", "rating")
    search_fields = ("user__email", "comment")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at",)
    list_select_related = ("user",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
