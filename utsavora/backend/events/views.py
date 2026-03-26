from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.cache import cache_page

from .models import Event, InvitationTemplate, EventCategory
from .serializers import EventSerializer, InvitationTemplateSerializer, EventDetailSerializer, EventMediaSerializer, PublicEventSerializer, EventCategorySerializer
from packages.models import Package
from packages.serializers import PackageSerializer
from django.core.files.base import ContentFile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import io
import requests
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
from django.template import Template, Context
from bookings.models import Booking
from .serializers_public import PublicEventRegistrationSerializer, PublicAttendeeSerializer

def generate_invitation_pdf(event):
    if not event.template:
        return
        
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Draw Background
    if event.template.preview_image:
        try:
            # ReportLab requires a file path or URL-like object
            bg_path = event.template.preview_image.path
            p.drawImage(bg_path, 0, 0, width=width, height=height)
        except Exception as e:
            print(f"Error loading background: {e}")

    # Draw Text (Basic implementation - can be enhanced with proper layout key logic)
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 30)
    p.drawCentredString(width / 2, height - 150, event.title)
    
    p.setFont("Helvetica", 18)
    date_str = f"{event.start_date} - {event.end_date}" if event.end_date else str(event.start_date)
    p.drawCentredString(width / 2, height - 200, date_str)
    
    p.drawCentredString(width / 2, height - 230, f"{event.venue}, {event.city}")
    
    p.setFont("Helvetica-Oblique", 14)
    p.drawCentredString(width / 2, height - 300, event.description)

    p.showPage()
    p.save()
    
    pdf_name = f"invitation_{event.id}.pdf"
    event.invitation_pdf.save(pdf_name, ContentFile(buffer.getvalue()), save=True)

@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 5)
def get_event_categories(request):
    categories = EventCategory.objects.all()
    serializer = EventCategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    data = request.data.copy()


    # Normalize registration_fee: empty string is invalid for DecimalField; use 0 for FREE/private
    fee = data.get('registration_fee')
    if fee is None or fee == '' or (isinstance(fee, str) and fee.strip() == ''):
        data['registration_fee'] = 0
    elif data.get('pricing_type') != 'PAID':
        data['registration_fee'] = 0

    serializer = EventSerializer(data=data, context={"request": request})
    if serializer.is_valid():
        # Visibility acts directly on its own enum mapping
        event = serializer.save(created_by=request.user, status="ACTIVE")
        
        # Handle Template Selection (Support both ID and Key)
        print("====== INCOMING CREATE DATA ======")
        print(data)
        template_id = data.get("template_id")
        template_key = data.get("invitation_template_key")
        print(f"template_id: {template_id}, template_key: {template_key}")
        template = None

        if template_id:
            try:
                template = InvitationTemplate.objects.get(id=template_id)
            except (InvitationTemplate.DoesNotExist, ValueError):
                pass
        
        if not template and template_key:
            try:
                template = InvitationTemplate.objects.get(template_key=template_key)
            except InvitationTemplate.DoesNotExist:
                pass

        if template:
            event.template = template
            event.save()
            
            # Send Email (Defensive Wrap)
            try:
                email_event_created(event)
            except Exception as e:
                print(f"⚠️ Email Error (Event Creation): {e}")
            
            # Reload to get the file URL
            event.refresh_from_db()
            return Response(EventSerializer(event).data, status=201)
                
        return Response(EventSerializer(event).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_events(request):
    events = Event.objects.filter(created_by=request.user).select_related('category', 'template').order_by('-created_at')
    
    # 🔄 Auto-update status
    for event in events:
        event.update_event_status()
        
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 5)
def public_events_upcoming(request):
    """Returns only strictly future PUBLIC/ACTIVE events — used for the search page."""
    today = timezone.now().date()
    events = Event.objects.filter(
        visibility='PUBLIC',
        status='ACTIVE',
        start_date__gte=today
    ).select_related('category', 'created_by').order_by('start_date')

    search = request.query_params.get('search', '')
    if search:
        events = events.filter(title__icontains=search)

    category = request.query_params.get('category', '')
    if category and category != 'All':
        if str(category).isdigit():
            events = events.filter(category_id=int(category))
        else:
            events = events.filter(category__slug__iexact=category)

    serializer = PublicEventSerializer(events, many=True)
    return Response(serializer.data)

from django.db.models import Q

@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 5)
def search_public_events(request):
    q = request.GET.get("q", "").strip()
    city = request.GET.get("city", "").strip()
    category = request.GET.get("category", "").strip()

    events = Event.objects.filter(
        visibility="PUBLIC",
        status="ACTIVE",
        start_date__gte=timezone.now().date()
    ).select_related('category')

    if q:
        events = events.filter(
            Q(title__icontains=q) |
            Q(description__icontains=q)
        )

    if city:
        events = events.filter(city__icontains=city)
        
    if category and category != 'All':
        if str(category).isdigit():
            events = events.filter(category_id=int(category))
        else:
            events = events.filter(category__slug__iexact=category)

    serializer = PublicEventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
@cache_page(60 * 5)
def get_active_templates(request):
    templates = InvitationTemplate.objects.filter(is_active=True)
    serializer = InvitationTemplateSerializer(templates, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_all_templates(request):
    templates = InvitationTemplate.objects.all()
    serializer = InvitationTemplateSerializer(templates, many=True)
    return Response(serializer.data)


from .models import Event, InvitationTemplate
from .serializers import EventSerializer, InvitationTemplateSerializer, EventDetailSerializer, EventMediaSerializer, PublicEventSerializer, PublicEventDetailSerializer
from .serializers_public import PublicEventRegistrationSerializer
from packages.models import Package
from packages.serializers import PackageSerializer

# ...

@api_view(['GET'])
@permission_classes([AllowAny])
def public_events(request):
    today = timezone.now().date()
    # ✅ Only upcoming, publicly visible, active events
    qs = Event.objects.filter(
        visibility='PUBLIC',
        status='ACTIVE',
        start_date__gte=today
    ).order_by('start_date')

    # Search
    search_query = request.GET.get('q')
    if search_query:
        qs = qs.filter(title__icontains=search_query)

    # Category: Event.category is FK to EventCategory (id or slug)
    category = request.GET.get('category')
    if category and category != 'All':
        if str(category).isdigit():
            qs = qs.filter(category_id=int(category))
        else:
            qs = qs.filter(category__slug__iexact=category)

    serializer = PublicEventSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def public_packages(request):
    # Filter packages where the associated ManagerProfile's user account has ACTIVE manager_status
    packages = Package.objects.filter(manager__manager_status="ACTIVE", is_active=True)
    
    category_id = request.GET.get('category')
    if category_id:
        packages = packages.filter(category_id=category_id)
        
    serializer = PackageSerializer(packages, many=True)
    return Response(serializer.data)

from .models import PublicEventRegistration
import razorpay
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

from events.services.email_service import email_public_registration, email_event_created

@api_view(['POST'])
@permission_classes([AllowAny])
def register_public_event(request, event_id):
    # Enforce strict rules: Public & Active only
    event = get_object_or_404(
        Event,
        id=event_id,
        visibility="PUBLIC",
        status="ACTIVE"
    )

    serializer = PublicEventRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ DUPLICATE CHECK — prevent IntegrityError on (event, email) unique constraint
    email = serializer.validated_data.get("email")
    if PublicEventRegistration.objects.filter(event=event, email=email).exists():
        return Response(
            {"error": "You are already registered for this event."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate initial status
    payment_status = "PAID" if event.pricing_type == "FREE" else "PENDING"
    reg_status = "CONFIRMED" if event.pricing_type == "FREE" else "PENDING"
    
    registration = serializer.save(
        event=event,
        payment_status=payment_status,
        status=reg_status
    )

    # ✅ FREE EVENT AUTO-CONFIRM LOGIC
    if event.pricing_type == "FREE":
        registration.amount_paid = 0
        registration.save()

        # Send invitation email
        email_public_registration(registration, event)

        return Response({
            "message": "Registered successfully for free event",
            "registration_id": registration.id,
            "status": registration.status
        }, status=status.HTTP_201_CREATED)

    # 🟡 PAID EVENT — payment required
    return Response({
        "status": "PAYMENT_REQUIRED",
        "message": "Registration created. Payment required.",
        "registration_id": registration.id,
        "amount": event.registration_fee
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([AllowAny])
def create_public_payment_order(request, registration_id=None):
    # Accept registration_id from either URL kwarg or request body
    rid = registration_id or request.data.get("registration_id")
    registration = get_object_or_404(PublicEventRegistration, id=rid)
    event = registration.event

    if event.pricing_type != "PAID":
        return Response({"error": "Event is free"}, status=400)
    
    amount = int(event.registration_fee * 100) # Paise
    
    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "receipt": f"receipt_{registration.id}",
        "notes": {
            "event_id": event.id,
            "registration_id": registration.id
        }
    })

    registration.razorpay_order_id = order["id"]
    registration.save()

    return Response({
        "order_id": order["id"],
        "amount": amount,
        "currency": "INR",
        "razorpay_key": settings.RAZORPAY_KEY_ID
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_public_payment(request):
    try:
        razorpay_order_id = request.data["razorpay_order_id"]
        razorpay_payment_id = request.data["razorpay_payment_id"]
        razorpay_signature = request.data["razorpay_signature"]

        # Verify signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

        registration = get_object_or_404(
            PublicEventRegistration,
            razorpay_order_id=razorpay_order_id
        )

        registration.razorpay_payment_id = razorpay_payment_id
        
        # ✅ AUTO CONFIRM
        registration.payment_status = "PAID"
        registration.status = "CONFIRMED"
        registration.save()

        # Send invitation email
        email_public_registration(registration, registration.event)

        return Response({
            "message": "Payment successful. Registration confirmed.",
            "registration_id": registration.id
        })

    except Exception as e:
        print(f"Payment Verification Error: {e}")
        return Response(
            {"error": "Payment verification failed"},
            status=400
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def public_attendee_list(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # 🔐 Permission check
    is_owner = event.created_by == request.user
    
    # ManagerProfile check: Is there a confirmed booking for this event where the logged-in user is the ManagerProfile?
    is_ManagerProfile = Booking.objects.filter(
        event=event,
        ManagerProfile=request.user,
        status__in=["CONFIRMED", "COMPLETED", "ACCEPTED"] # Broadened safety check, but user asked for CONFIRMED
    ).exists()
    
    # Sticking to strict user request for CONFIRMED if required, but usually ACCEPTED/COMPLETED also implies access.
    # User said: status="CONFIRMED". I will stick to what they asked unless it breaks logic.
    is_ManagerProfile_strict = Booking.objects.filter(
        event=event,
        ManagerProfile=request.user,
        status="CONFIRMED"
    ).exists()

    if not (is_owner or is_ManagerProfile_strict):
        return Response(
            {"detail": "Not authorized"},
            status=403
        )

    attendees = PublicEventRegistration.objects.filter(
        event=event,
        status="CONFIRMED" # Only confirmed attendees
    ).order_by("-created_at")

    serializer = PublicAttendeeSerializer(attendees, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_public_event_detail(request, event_id):
    # Allow both ACTIVE and COMPLETED events to be viewed publicly
    # (prevents 404 when someone shares a link to a recently completed event)
    event = get_object_or_404(
        Event,
        id=event_id,
        visibility='PUBLIC',
        status__in=['ACTIVE', 'COMPLETED']
    )
    serializer = PublicEventDetailSerializer(event)
    return Response(serializer.data)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_detail(request, id):
    try:
        # Check if user owns the event OR if it's public (optional logic, but sticking to user for now)
        event = Event.objects.get(id=id, created_by=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=404)

    # 🔄 Auto-update status
    event.update_event_status()

    serializer = EventDetailSerializer(event, context={'request': request})
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_event(request, id):
    try:
        event = Event.objects.get(id=id, created_by=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=404)

    # 🛑 Prevent deletion if any booking has been paid
    has_paid_booking = Booking.objects.filter(
        event=event,
        payment_status="PAID"
    ).exists()

    if has_paid_booking:
        return Response(
            {"detail": "Cannot delete event — a ManagerProfile has been paid for this event. Contact support for cancellation."},
            status=403
        )

    event.delete()
    return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

from datetime import timedelta
from django.utils import timezone
from .models import EventMedia

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_event_media(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    
    # 1. Check ownership - Actually, maybe guests should be allowed? 
    # User requirement said "Event created... 5 images". Implicitly owner-only based on code so far.
    # Sticking to owner logic as implemented previously unless requested otherwise.
    if event.created_by != request.user:
        return Response({"error": "Not authorized"}, status=403)

    # 2. Check strict deadline usage centralized method
    if not event.can_upload_media():
        return Response({"error": "Upload period has expired"}, status=403)

    # 3. Determine Limit based on Booking Status (ACCEPTED + PAID)
    from bookings.models import Booking
    
    booking = Booking.objects.filter(event=event).order_by("-created_at").first()
    manager_hired = booking is not None
    payment_done = booking and booking.payment_status == "FULLY_PAID"

    if manager_hired and payment_done:
        media_limit = 20
    else:
        media_limit = 5
    
    # 4. Enforce Limit
    uploaded_count = event.media.count()
    if uploaded_count >= media_limit:
        return Response({
            "error": f"Upload limit reached ({media_limit} images)."
        }, status=400)

    image = request.FILES.get("image")
    if not image:
        return Response({"error": "No image provided"}, status=400)

    # ✅ File size validation (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if image.size > max_size:
        return Response({"error": "File too large. Maximum allowed size is 5MB."}, status=400)

    EventMedia.objects.create(
        event=event,
        uploaded_by=request.user,
        image=image
    )

    return Response({"success": True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_event_media(request, event_id):
    # Check ownership or public access depending on rules. Sticking to owner/user provided snippet
    try:
        event = Event.objects.get(id=event_id, created_by=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found"}, status=404)

    media = EventMedia.objects.filter(event=event).order_by("-created_at")
    serializer = EventMediaSerializer(media, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_memory_limit(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    
    # 1. Check ownership
    if event.created_by != request.user:
        return Response({"error": "Not authorized"}, status=403)

    images_count = EventMedia.objects.filter(event=event).count()

    from bookings.models import Booking
    booking = Booking.objects.filter(event=event).order_by("-created_at").first()

    manager_hired = booking is not None
    payment_done = booking and booking.payment_status == "FULLY_PAID"

    if manager_hired and payment_done:
        max_images = 20
    else:
        max_images = 5

    return Response({
        "max_images": max_images,
        "uploaded": images_count
    })



@api_view(["GET"])
@permission_classes([AllowAny])
def render_invitation(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    if not event.template:
        return HttpResponse("No template selected", status=400)

    html = event.template.html_content

    context = Context({
        "event_name": event.title,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "city": event.city,
        "location": event.venue,
        "description": event.description,
        "contact_numbers": event.contact_numbers,
    })

    rendered = Template(html).render(context)
    return HttpResponse(rendered)

try:
    from weasyprint import HTML
except (OSError, ImportError, Exception) as e:
        weasyprint = None
        pass

@api_view(["GET"])
@permission_classes([AllowAny])
def download_invitation_pdf(request, event_id):
    if not HTML:
        return HttpResponse("PDF generation is not available on this server (Missing GTK libraries).", status=501)

    event = get_object_or_404(Event, id=event_id)
    if not event.template:
        return HttpResponse("No template selected", status=400)
    
    html = event.template.html_content
    context = Context({
        "event_name": event.title,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "location": event.venue,
        "city": event.city,
        "description": event.description,
        "contact_numbers": event.contact_numbers,
    })
    rendered_html = Template(html).render(context)
    
    pdf_file = HTML(string=rendered_html).write_pdf()
    
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invitation_{event.id}.pdf"'
    return response

import bleach

# Allowed tags and attributes for sanitization
ALLOWED_TAGS = ['div', 'span', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'img', 'a', 'style', 'table', 'tbody', 'thead', 'tr', 'td', 'th']
ALLOWED_ATTRIBUTES = {
    '*': ['class', 'style', 'id'],
    'a': ['href', 'target'],
    'img': ['src', 'alt', 'width', 'height']
}

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_template(request):
    data = request.data.copy()
    if 'html_content' in data:
        data['html_content'] = bleach.clean(data['html_content'], tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)
        
    serializer = InvitationTemplateSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_template(request, pk):
    try:
        template = InvitationTemplate.objects.get(pk=pk)
    except InvitationTemplate.DoesNotExist:
        return Response({"detail": "Template not found"}, status=404)

    data = request.data.copy()
    if 'html_content' in data:
         data['html_content'] = bleach.clean(data['html_content'], tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)

    serializer = InvitationTemplateSerializer(template, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['POST', 'PUT']) # Accept both for flexibility
@permission_classes([IsAdminUser])
def toggle_template(request, pk):
    try:
        template = InvitationTemplate.objects.get(pk=pk)
        # Check if specific state is requested, otherwise toggle
        if 'is_active' in request.data:
            template.is_active = request.data['is_active']
        else:
            template.is_active = not template.is_active
        template.save()
        return Response({"status": "success", "is_active": template.is_active})
    except InvitationTemplate.DoesNotExist:
        return Response({"detail": "Template not found"}, status=404)
