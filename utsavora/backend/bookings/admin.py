from django.contrib import admin
from .models import ManagerAvailability, Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('event', 'manager', 'user', 'status', 'payment_deadline', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('manager__email', 'user__email', 'event__title')


@admin.register(ManagerAvailability)
class ManagerAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('manager', 'start_date', 'end_date', 'booking', 'created_at')
    list_filter = ('start_date', 'end_date')
    search_fields = ('manager__email',)
