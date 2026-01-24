import os
import django
from django.conf import settings
import razorpay

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def verify_razorpay():
    try:
        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            print("❌ Razorpay Keys missing in settings!")
            return

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        print(f"✅ Razorpay Client initialized with Key ID: {settings.RAZORPAY_KEY_ID}")
        
    except ImportError:
        print("❌ razorpay module not found!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_razorpay()
