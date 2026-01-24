from django.contrib import admin
from .models import Package

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'manager', 'price', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'manager__company_name')
