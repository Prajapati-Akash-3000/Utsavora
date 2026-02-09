from django.core.management.base import BaseCommand
from payments.services import auto_release_payments

class Command(BaseCommand):
    help = "Release escrow payments automatically"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting auto-release process...")
        count = auto_release_payments()
        self.stdout.write(self.style.SUCCESS(f"Escrow release completed. Processed {count} payments."))
