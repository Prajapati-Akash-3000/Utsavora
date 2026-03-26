from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .email_templates import (
    event_created_html, 
    ManagerProfile_accepted_html, 
    payment_confirmed_html, 
    public_registration_html,
    ManagerProfile_request_html,
    event_completed_html,
    event_cancelled_html
)

def send_email(subject, message, to, html_message=None):
    """
    Core utility to send email (Text + HTML).
    """
    if isinstance(to, str):
        to = [to]
        
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=message, # Plain text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to
        )
        if html_message:
            email.attach_alternative(html_message, "text/html")
            
        email.send(fail_silently=False)
        print(f"✅ Email sent to {to}: {subject}")
    except Exception as e:
        print(f"❌ Failed to send email to {to}: {e}")

# -------------------------------------------------------------------------
# EVENT LIFECYCLE EMAILS
# -------------------------------------------------------------------------

def email_event_created(event):
    subject = "Your event has been created 🎉"
    text_message = f"Your event '{event.title}' has been successfully created."
    html_message = event_created_html(event)
    
    send_email(subject, text_message, event.created_by.email, html_message)

def email_ManagerProfile_request(ManagerProfile, event):
    subject = f"New Event Request: {event.title}"
    text_message = f"You have a new booking request for '{event.title}'."
    html_message = ManagerProfile_request_html(ManagerProfile, event)
    
    send_email(subject, text_message, ManagerProfile.email, html_message)

def email_ManagerProfile_accepted(user, event):
    subject = "ManagerProfile accepted your request ✅"
    text_message = f"Good news! ManagerProfile accepted your request for '{event.title}'."
    html_message = ManagerProfile_accepted_html(event)
    
    send_email(subject, text_message, user.email, html_message)

def email_payment_confirmed(user, ManagerProfile, event, amount_paid):
    # Email to User
    user_subject = "Booking Confirmed! 🚀"
    user_text = f"Your booking for '{event.title}' is confirmed."
    user_html = payment_confirmed_html(event, amount_paid)
    
    send_email(user_subject, user_text, user.email, user_html)

    # Email to ManagerProfile (Reusing payment html or create separate if needed, distinct text ok)
    ManagerProfile_subject = f"New Confirmed Booking: {event.title} 📅"
    ManagerProfile_text = f"You have a confirmed booking for '{event.title}'."
    # For now sending same styled confirm email to ManagerProfile, or simple text if no specific template
    # Let's reuse payment_confirmed_html but maybe title is slightly generic? 
    # "Booking Confirmed" works for both.
    
    send_email(ManagerProfile_subject, ManagerProfile_text, ManagerProfile.email, user_html)

def email_public_registration(registration, event):
    subject = f"You're going to {event.title}! 🎟️"
    text_message = f"Your registration for '{event.title}' is confirmed."
    html_message = public_registration_html(registration, event)
    
    send_email(subject, text_message, registration.email, html_message)

def email_event_completed(event):
    subject = f"Hope you enjoyed {event.title}! 🎊"
    text_message = f"Your event '{event.title}' is now completed."
    html_message = event_completed_html(event)
    
    send_email(subject, text_message, event.created_by.email, html_message)

def email_event_cancelled(event):
    subject = f"Event Cancelled: {event.title}"
    text_message = f"Your event '{event.title}' has been cancelled."
    html_message = event_cancelled_html(event)
    
    send_email(subject, text_message, event.created_by.email, html_message)
