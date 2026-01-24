import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User

if not User.objects.filter(email='akashprajapati9019@gmail.com').exists():
    User.objects.create_superuser('akashprajapati9019@gmail.com', 'adminpass123', full_name='Super Admin')
    print("Superuser created.")
else:
    print("Superuser already exists.")
