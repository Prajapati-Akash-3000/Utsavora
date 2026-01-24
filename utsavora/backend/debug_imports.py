import os
import sys
import django

# Add project root to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

try:
    from accounts import urls
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
