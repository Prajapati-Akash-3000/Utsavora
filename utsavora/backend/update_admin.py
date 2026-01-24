import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User

try:
    admin = User.objects.get(email="akashprj3000@gmail.com")
    admin.role = "ADMIN"
    admin.is_verified = True
    admin.manager_status = 'ACTIVE'
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()
    print("Admin updated successfully.")
except User.DoesNotExist:
    # Auto-create if not exists
    try:
        User.objects.create_superuser('akashprj3000@gmail.com', 'adminpass123', full_name='Admin User', is_verified=True, manager_status='ACTIVE')
        print("User akashprj3000@gmail.com created as Superuser.")
    except Exception as e:
        print(f"Error creating user: {e}")

except Exception as e:
    print(f"Error: {e}")
