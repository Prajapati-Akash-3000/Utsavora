import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
except Exception:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()

from django.db import transaction
from events.models import Event, EventCategory, InvitationTemplate
from packages.models import Package

def merge_category(source_slug, target_slug):
    try:
        source_cat = EventCategory.objects.get(slug=source_slug)
        target_cat = EventCategory.objects.get(slug=target_slug)
    except EventCategory.DoesNotExist as e:
        print(f"Merge skipped: {e}")
        return

    with transaction.atomic():
        events_updated = Event.objects.filter(category=source_cat).update(category=target_cat)
        packages_updated = Package.objects.filter(category=source_cat).update(category=target_cat)
        templates_updated = InvitationTemplate.objects.filter(category=source_cat).update(category=target_cat)
        
        print(f"Transferred {events_updated} Events, {packages_updated} Packages, {templates_updated} Templates from {source_slug} to {target_slug}")
        source_cat.delete()
        print(f"Deleted source category: {source_slug}")

if __name__ == '__main__':
    merge_category('corporate-event', 'corporate')
    merge_category('birthday-party', 'birthday')
    print("Merge script completed successfully.")
