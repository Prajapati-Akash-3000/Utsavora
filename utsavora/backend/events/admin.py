from django.contrib import admin
from .models import Event, InvitationTemplate, ServicePackage

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'start_date', 'status', 'created_at')
    list_filter = ('status', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'city')
    ordering = ('-created_at',)

@admin.register(InvitationTemplate)
class InvitationTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "template_key", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name", "template_key")

@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ("name", "manager", "price", "event_type", "is_active")
    list_filter = ("event_type", "is_active")
    search_fields = ("name", "manager__email")
