from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import (
    AdminProfile,
    AuditLog,
    BankDetails,
    EmailOTP,
    ManagerAvailability,
    ManagerProfile,
    User,
)
from bookings.models import Booking
from events.models import Event, EventCategory, EventMedia, InvitationTemplate, PublicEventRegistration
from packages.models import Package
from payments.models import Payment
from reviews.models import Review


class Command(BaseCommand):
    help = "Seed realistic showcase data across all current project tables."

    @transaction.atomic
    def handle(self, *args, **options):
        today = timezone.now().date()

        # ---------------------------------------------------------
        # 1) Users and Profiles
        # ---------------------------------------------------------
        admin_user, _ = User.objects.get_or_create(
            email="admin.ops@utsavora.in",
            defaults={
                "role": "ADMIN",
                "full_name": "Operations Admin",
                "mobile": "9890012345",
                "is_verified": True,
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if not admin_user.is_staff or not admin_user.is_superuser:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save(update_fields=["is_staff", "is_superuser"])
        admin_user.set_password("Admin@12345")
        admin_user.save(update_fields=["password"])
        admin_profile, _ = AdminProfile.objects.get_or_create(
            user=admin_user, defaults={"employee_id": "UTS-ADM-001"}
        )

        manager_user_1, _ = User.objects.get_or_create(
            email="rajat.planner@utsavora.in",
            defaults={
                "role": "MANAGER",
                "full_name": "Rajat Sharma",
                "mobile": "9811001122",
                "is_verified": True,
                "is_active": True,
            },
        )
        manager_user_1.set_password("Manager@123")
        manager_user_1.save(update_fields=["password"])

        manager_user_2, _ = User.objects.get_or_create(
            email="neha.events@utsavora.in",
            defaults={
                "role": "MANAGER",
                "full_name": "Neha Verma",
                "mobile": "9811003344",
                "is_verified": True,
                "is_active": True,
            },
        )
        manager_user_2.set_password("Manager@123")
        manager_user_2.save(update_fields=["password"])

        user_1, _ = User.objects.get_or_create(
            email="ananya.mehta@gmail.com",
            defaults={
                "role": "USER",
                "full_name": "Ananya Mehta",
                "mobile": "9876543210",
                "is_verified": True,
                "is_active": True,
            },
        )
        user_1.set_password("User@12345")
        user_1.save(update_fields=["password"])

        user_2, _ = User.objects.get_or_create(
            email="ravi.kapoor@gmail.com",
            defaults={
                "role": "USER",
                "full_name": "Ravi Kapoor",
                "mobile": "9876504321",
                "is_verified": True,
                "is_active": True,
            },
        )
        user_2.set_password("User@12345")
        user_2.save(update_fields=["password"])

        manager_profile_1, _ = ManagerProfile.objects.get_or_create(
            user=manager_user_1,
            defaults={
                "company_name": "Sharma Signature Events",
                "manager_status": "ACTIVE",
                "bank_added": True,
                "approved_by": admin_profile,
                "approved_at": timezone.now() - timedelta(days=45),
            },
        )
        if manager_profile_1.manager_status != "ACTIVE":
            manager_profile_1.manager_status = "ACTIVE"
            manager_profile_1.approved_by = admin_profile
            manager_profile_1.approved_at = timezone.now() - timedelta(days=45)
            manager_profile_1.save(
                update_fields=["manager_status", "approved_by", "approved_at"]
            )

        manager_profile_2, _ = ManagerProfile.objects.get_or_create(
            user=manager_user_2,
            defaults={
                "company_name": "Neha Premium Planners",
                "manager_status": "PENDING",
                "bank_added": False,
            },
        )

        BankDetails.objects.get_or_create(
            manager=manager_profile_1,
            defaults={
                "account_holder_name": "Rajat Sharma",
                "account_number": "456789123456",
                "ifsc_code": "HDFC0004567",
                "bank_name": "HDFC Bank",
            },
        )

        # ---------------------------------------------------------
        # 2) Core Master Data
        # ---------------------------------------------------------
        wedding_cat, _ = EventCategory.objects.get_or_create(
            slug="wedding", defaults={"name": "Wedding"}
        )
        corporate_cat, _ = EventCategory.objects.get_or_create(
            slug="corporate", defaults={"name": "Corporate Event"}
        )
        birthday_cat, _ = EventCategory.objects.get_or_create(
            slug="birthday", defaults={"name": "Birthday"}
        )

        invite_template_1, _ = InvitationTemplate.objects.get_or_create(
            template_key="wedding_royal_gold",
            defaults={
                "name": "Royal Gold Wedding",
                "category": wedding_cat,
                "preview_image": "templates/previews/royal-gold.jpg",
                "html_content": "<h1>{{ host_name }} invites you to {{ event_title }}</h1>",
                "is_active": True,
            },
        )
        invite_template_2, _ = InvitationTemplate.objects.get_or_create(
            template_key="corporate_minimal_blue",
            defaults={
                "name": "Corporate Minimal Blue",
                "category": corporate_cat,
                "preview_image": "templates/previews/corporate-blue.jpg",
                "html_content": "<h2>{{ event_title }}</h2><p>{{ venue }}</p>",
                "is_active": True,
            },
        )

        # ---------------------------------------------------------
        # 3) Events (past + present/future)
        # ---------------------------------------------------------
        past_event, _ = Event.objects.get_or_create(
            created_by=user_1,
            title="Mehta Family Wedding Reception",
            defaults={
                "description": "Wedding reception with curated decor and live music.",
                "start_date": today - timedelta(days=60),
                "end_date": today - timedelta(days=59),
                "venue": "The Royal Orchid, Ahmedabad",
                "city": "Ahmedabad",
                "category": wedding_cat,
                "template": invite_template_1,
                "invitation_data": {"host_name": "Mehta Family", "dress_code": "Traditional"},
                "visibility": "PRIVATE",
                "pricing_type": "FREE",
                "registration_fee": Decimal("0.00"),
                "contact_numbers": "9876543210, 9822001100",
                "status": "COMPLETED",
            },
        )

        current_event, _ = Event.objects.get_or_create(
            created_by=user_2,
            title="Utsavora Startup Networking Evening",
            defaults={
                "description": "Networking and founder panel for local startups.",
                "start_date": today + timedelta(days=3),
                "end_date": today + timedelta(days=3),
                "venue": "GIFT City Convention Hall",
                "city": "Gandhinagar",
                "category": corporate_cat,
                "template": invite_template_2,
                "invitation_data": {"host_name": "Utsavora Team", "agenda": "Panels + Networking"},
                "visibility": "PUBLIC",
                "pricing_type": "PAID",
                "registration_fee": Decimal("799.00"),
                "contact_numbers": "9890012345",
                "status": "ACTIVE",
            },
        )

        upcoming_event, _ = Event.objects.get_or_create(
            created_by=user_1,
            title="Ananya 30th Birthday Celebration",
            defaults={
                "description": "Private birthday evening with themed decor.",
                "start_date": today + timedelta(days=20),
                "end_date": today + timedelta(days=20),
                "venue": "Lakeview Banquet, Surat",
                "city": "Surat",
                "category": birthday_cat,
                "template": invite_template_1,
                "invitation_data": {"host_name": "Ananya", "theme": "Midnight Blue"},
                "visibility": "PRIVATE",
                "pricing_type": "FREE",
                "registration_fee": Decimal("0.00"),
                "contact_numbers": "9876543210",
                "status": "ACTIVE",
            },
        )

        EventMedia.objects.get_or_create(
            event=past_event,
            image="event_media/wedding-stage-ahmedabad.jpg",
            defaults={"uploaded_by": manager_user_1},
        )
        EventMedia.objects.get_or_create(
            event=current_event,
            image="event_media/startup-networking-banner.jpg",
            defaults={"uploaded_by": admin_user},
        )

        # ---------------------------------------------------------
        # 4) Packages
        # ---------------------------------------------------------
        wedding_package, _ = Package.objects.get_or_create(
            manager=manager_profile_1,
            title="Wedding Signature Package",
            defaults={
                "description": "Venue styling, guest coordination, and on-day management.",
                "price": Decimal("145000.00"),
                "category": wedding_cat,
                "is_active": True,
            },
        )
        corporate_package, _ = Package.objects.get_or_create(
            manager=manager_profile_1,
            title="Corporate Networking Package",
            defaults={
                "description": "Stage setup, AV coordination, guest desk and hospitality.",
                "price": Decimal("72000.00"),
                "category": corporate_cat,
                "is_active": True,
            },
        )

        # ---------------------------------------------------------
        # 5) Bookings and Payments
        # ---------------------------------------------------------
        completed_booking, _ = Booking.objects.get_or_create(
            event=past_event,
            user=user_1,
            manager=manager_profile_1,
            defaults={
                "package": wedding_package,
                "status": "COMPLETED",
                "payment_status": "FULLY_PAID",
                "payment_id": "pay_wed_2026_0001",
                "total_amount": Decimal("145000.00"),
                "paid_amount": Decimal("145000.00"),
                "accepted_at": timezone.now() - timedelta(days=65),
            },
        )

        confirmed_booking, _ = Booking.objects.get_or_create(
            event=current_event,
            user=user_2,
            manager=manager_profile_1,
            defaults={
                "package": corporate_package,
                "status": "CONFIRMED",
                "payment_status": "PARTIALLY_PAID",
                "payment_id": "pay_corp_2026_0007",
                "payment_deadline": timezone.now() + timedelta(days=2),
                "total_amount": Decimal("72000.00"),
                "paid_amount": Decimal("36000.00"),
                "accepted_at": timezone.now() - timedelta(days=1),
            },
        )

        pending_booking, _ = Booking.objects.get_or_create(
            event=upcoming_event,
            user=user_1,
            manager=manager_profile_2,
            defaults={
                "package": None,
                "status": "PENDING",
                "payment_status": "UNPAID",
                "total_amount": Decimal("45000.00"),
                "paid_amount": Decimal("0.00"),
            },
        )

        Payment.objects.get_or_create(
            booking=completed_booking,
            razorpay_order_id="order_wed_2026_1001",
            defaults={
                "razorpay_payment_id": "pay_wed_2026_1001",
                "razorpay_signature": "signature_wed_2026_1001",
                "transaction_id": "txn_wed_2026_1001",
                "amount": Decimal("145000.00"),
                "platform_fee": Decimal("14500.00"),
                "manager_amount": Decimal("130500.00"),
                "status": "RELEASED",
                "payment_type": "FULL",
            },
        )
        Payment.objects.get_or_create(
            booking=confirmed_booking,
            razorpay_order_id="order_corp_2026_2007",
            defaults={
                "razorpay_payment_id": "pay_corp_2026_2007",
                "razorpay_signature": "signature_corp_2026_2007",
                "transaction_id": "txn_corp_2026_2007",
                "amount": Decimal("36000.00"),
                "platform_fee": Decimal("3600.00"),
                "manager_amount": Decimal("32400.00"),
                "status": "ESCROW",
                "payment_type": "ADVANCE",
            },
        )

        # ---------------------------------------------------------
        # 6) Manager Availability (past + future)
        # ---------------------------------------------------------
        for day_delta in range(60, 58, -1):
            ManagerAvailability.objects.get_or_create(
                manager=manager_profile_1,
                date=today - timedelta(days=day_delta),
                defaults={"status": "BOOKED", "booking": completed_booking},
            )

        ManagerAvailability.objects.get_or_create(
            manager=manager_profile_1,
            date=today + timedelta(days=3),
            defaults={"status": "BOOKED", "booking": confirmed_booking},
        )
        ManagerAvailability.objects.get_or_create(
            manager=manager_profile_1,
            date=today + timedelta(days=4),
            defaults={"status": "BLOCKED"},
        )

        # ---------------------------------------------------------
        # 7) Public Registrations
        # ---------------------------------------------------------
        PublicEventRegistration.objects.get_or_create(
            event=current_event,
            email="founder.isha@gmail.com",
            defaults={
                "full_name": "Isha Patel",
                "mobile": "9765512345",
                "status": "CONFIRMED",
                "payment_status": "PAID",
                "razorpay_order_id": "order_pub_2026_9001",
                "razorpay_payment_id": "pay_pub_2026_9001",
                "amount_paid": Decimal("799.00"),
            },
        )
        PublicEventRegistration.objects.get_or_create(
            event=current_event,
            email="investor.arjun@gmail.com",
            defaults={
                "full_name": "Arjun Desai",
                "mobile": "9988776655",
                "status": "PENDING",
                "payment_status": "PENDING",
                "amount_paid": Decimal("0.00"),
            },
        )

        # ---------------------------------------------------------
        # 8) OTP, Reviews, Audit Logs
        # ---------------------------------------------------------
        EmailOTP.objects.get_or_create(
            user=user_1,
            otp="238541",
            defaults={
                "expires_at": timezone.now() + timedelta(minutes=5),
                "is_used": False,
            },
        )
        EmailOTP.objects.get_or_create(
            user=manager_user_2,
            otp="774209",
            defaults={
                "expires_at": timezone.now() - timedelta(minutes=10),
                "is_used": True,
            },
        )

        Review.objects.get_or_create(
            user=user_1,
            defaults={
                "rating": 5,
                "comment": "Excellent manager coordination and timely execution.",
                "role": "USER",
            },
        )
        Review.objects.get_or_create(
            user=manager_user_1,
            defaults={
                "rating": 4,
                "comment": "Platform workflow and payment visibility are very useful.",
                "role": "MANAGER",
            },
        )

        AuditLog.objects.get_or_create(
            user_email=manager_user_1.email,
            action="MANAGER_APPROVED",
            ip_address="127.0.0.1",
            defaults={
                "admin": admin_profile,
                "meta": {"reason": "Documents verified and onboarding completed"},
            },
        )
        AuditLog.objects.get_or_create(
            user_email=user_1.email,
            action="LOGIN_SUCCESS",
            ip_address="127.0.0.1",
            defaults={"meta": {"channel": "web"}},
        )

        self.stdout.write(self.style.SUCCESS("Showcase seed data created/updated successfully."))
        self.stdout.write(
            self.style.WARNING(
                "Credentials: admin.ops@utsavora.in / Admin@12345 | "
                "rajat.planner@utsavora.in / Manager@123 | "
                "ananya.mehta@gmail.com / User@12345"
            )
        )
