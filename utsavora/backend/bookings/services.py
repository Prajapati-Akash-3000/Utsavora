def is_ManagerProfile_available(ManagerProfile, date):
    """
    Check if a ManagerProfile is available on a given date.
    Returns True if available, False if blocked.
    """
    from accounts.models import ManagerAvailability

    # Single source of truth: `accounts.ManagerAvailability`
    # Any row for that date means the ManagerProfile is unavailable.
    return not ManagerAvailability.objects.filter(ManagerProfile=ManagerProfile, date=date).exists()
