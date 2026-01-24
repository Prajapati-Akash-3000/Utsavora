import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from bookings.tasks import expire_unpaid_bookings

print("Running expire_unpaid_bookings task...")
expire_unpaid_bookings()
print("Task completed.")
