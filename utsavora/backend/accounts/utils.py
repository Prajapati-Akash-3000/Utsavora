import random
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from events.services.email_templates import base_email, BRAND

def send_otp(email, otp):
    subject = 'Your Secure OTP for Utsavora 🔐'
    text_message = f'Your OTP code is {otp}. This code expires in exactly 5 minutes.'
    email_from = settings.DEFAULT_FROM_EMAIL
    
    # Constructing a stunning OTP template using the new Master Base
    html_content = f"""
    <p style="margin-bottom:20px;">Protecting your account is our top priority. Please use the following One-Time Password to securely authenticate your request.</p>

    <div style="text-align:center;margin:35px 0;">
      <div style="display:inline-block;background-color:#ffffff;border:2px dashed {BRAND['primary']};padding:20px 40px;border-radius:16px;">
        <span style="font-family:monospace;font-size:36px;font-weight:900;letter-spacing:10px;color:{BRAND['primary']};">{otp}</span>
      </div>
    </div>

    <div style="background-color:#fef2f2;border:1px solid #fee2e2;padding:16px;border-radius:12px;margin:20px 0;">
      <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">⚠️ Do not share this code. Our support team will never ask for it. This code will expire automatically in 5 minutes.</p>
    </div>
    """
    
    html_payload = base_email("Account Authentication Required", html_content)
    
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=email_from,
        to=[email]
    )
    msg.attach_alternative(html_payload, "text/html")
    msg.send(fail_silently=False)

