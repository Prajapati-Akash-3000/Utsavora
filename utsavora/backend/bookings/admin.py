from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('event', 'manager', 'user', 'status', 'payment_deadline', 'created_at')
    list_filter = ('status', 'created_at')
