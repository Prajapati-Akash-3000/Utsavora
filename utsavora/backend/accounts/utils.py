import random
from django.core.mail import send_mail
from django.conf import settings

def send_otp(email, otp):
    subject = 'Your OTP for Utsavora'
    message = f'Your OTP is {otp}. It expires in 5 minutes.'
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)
