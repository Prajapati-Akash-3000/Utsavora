from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_public_event_invitation_email(registration):
    event = registration.event

    subject = f"🎉 You're Invited: {event.title}"

    html_content = render_to_string(
        "emails/public_event_invitation.html",
        {
            "event": event,
            "registration": registration
        }
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=f"You're invited to {event.title}! Please enable HTML emails to view your invitation.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[registration.email]
    )

    email.attach_alternative(html_content, "text/html")
    email.send()
