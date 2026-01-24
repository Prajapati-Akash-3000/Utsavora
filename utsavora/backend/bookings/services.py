from manager.models import ManagerBlockedDate

def is_manager_available(manager, date):
    """
    Check if a manager is available on a given date.
    Returns True if available, False if blocked.
    """
    # Check manual blocks
    if hasattr(manager, 'managerprofile'):
        if ManagerBlockedDate.objects.filter(manager=manager.managerprofile, date=date).exists():
            return False
            
    # Note: We should also check for CONFIRMED bookings to be safe, 
    # but the ManagerBlockedDate is now the source of truth for "locked" dates
    # because accepting a booking creates a ManagerBlockedDate.
    
    return True
