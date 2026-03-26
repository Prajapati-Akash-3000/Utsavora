from accounts.models import ManagerAvailability

def is_ManagerProfile_available(ManagerProfile, start_date, end_date):
    """
    ManagerAvailability is stored per-day (one row per date).
    ManagerProfile is available for a range if there are no rows in that range.
    """
    if not start_date or not end_date:
        return True

    return not ManagerAvailability.objects.filter(
        ManagerProfile=ManagerProfile,
        date__range=(start_date, end_date),
    ).exists()
