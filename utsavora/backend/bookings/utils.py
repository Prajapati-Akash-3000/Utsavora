from django.db.models import Q
from .models import ManagerAvailability

def is_manager_available(manager, start_date, end_date):
    return not ManagerAvailability.objects.filter(
        manager=manager
    ).filter(
        Q(start_date__lte=end_date) &
        Q(end_date__gte=start_date)
    ).exists()
