from django.core.mail import send_mail
from django.conf import settings

def send_event_email(subject, message, recipients):
    """
    Sends an email using the configured SMTP server.
    
    Args:
        subject (str): The subject of the email.
        message (str): The plain text message body.
        recipients (list): List of recipient email addresses.
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
        print(f"✅ Email sent to {recipients}: {subject}")
    except Exception as e:
        print(f"❌ Failed to send email to {recipients}: {e}")
