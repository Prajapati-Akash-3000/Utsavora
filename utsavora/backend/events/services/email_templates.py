from datetime import datetime

BRAND = {
    "name": "Utsavora",
    "primary": "#6D28D9",   # purple-600
    "secondary": "#F3E8FF",
    "text": "#1F2937",
    "muted": "#6B7280",
    "footer": "© Utsavora • Celebrate Moments"
}

def base_email(title, body_html):
    """
    Master template for all premium emails.
    Highly compatible with all major email clients (uses tables for layout).
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f5f7;padding:40px 20px;">
        <tr>
          <td align="center">
            
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);">
              <!-- Header -->
              <tr>
                <td style="background-color:{BRAND['primary']};padding:35px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">{BRAND['name']}</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:{BRAND['primary']};font-size:22px;font-weight:800;margin-top:0;margin-bottom:24px;letter-spacing:-0.3px;">{title}</h2>
                  
                  <div style="color:{BRAND['text']};font-size:16px;line-height:1.6;">
                    {body_html}
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color:#f9fafb;padding:24px;text-align:center;border-top:1px solid #f3f4f6;">
                  <p style="color:{BRAND['muted']};font-size:13px;margin:0;font-weight:500;">{BRAND['footer']}</p>
                  <p style="color:#9ca3af;font-size:11px;margin-top:8px;">This is an automated message, please do not reply.</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    """

def _stat_block(label, value):
    return f"""
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
      <tr>
        <td width="30%" style="color:{BRAND['muted']};font-size:14px;font-weight:600;padding-bottom:4px;">{label}</td>
        <td width="70%" style="color:{BRAND['text']};font-size:15px;font-weight:700;padding-bottom:4px;">{value}</td>
      </tr>
    </table>
    """

def _button(url, text):
    return f"""
    <div style="margin-top:35px;text-align:center;">
        <a href="{url}" style="display:inline-block;background-color:{BRAND['primary']};color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.3px;">{text}</a>
    </div>
    """

def _format_datetime(date_obj, time_obj):
    if not date_obj:
        return "TBA"
    date_str = date_obj.strftime("%d %b, %Y")
    if time_obj:
        return f"{date_str} at {time_obj.strftime('%I:%M %p')}"
    return date_str

def event_created_html(event):
    start_str = _format_datetime(event.start_date, event.start_time)
    end_str = _format_datetime(event.end_date, event.end_time)

    body = f"""
    <p style="margin-bottom:20px;">Your magnificent event <strong>{event.title}</strong> has been created successfully! 🎉</p>

    <div style="background-color:{BRAND['secondary']};padding:24px;border-radius:12px;margin:30px 0;">
      {_stat_block("📍 Venue", f"{event.venue}, {event.city}")}
      {_stat_block("🟢 Starts", start_str)}
      {_stat_block("🛑 Ends", end_str)}
    </div>

    <p style="margin-top:20px;">You're on your way to creating unforgettable memories. You can manage invitations, hire Managers, and track guest RSVPs anytime from your dashboard.</p>
    
    {_button("#", "View Event Dashboard")}
    """
    return base_email("Event Created Successfully", body)

def ManagerProfile_request_html(ManagerProfile, event):
    start_str = _format_datetime(event.start_date, event.start_time)
    end_str = _format_datetime(event.end_date, event.end_time)

    body = f"""
    <p style="margin-bottom:16px;">Hello <strong>{ManagerProfile.full_name}</strong>,</p>
    
    <p style="margin-bottom:20px;">You have received a new booking request for an upcoming event! 📋</p>
    
    <div style="background-color:{BRAND['secondary']};padding:24px;border-radius:12px;margin:30px 0;border-left:4px solid {BRAND['primary']};">
      {_stat_block("🎭 Event", event.title)}
      {_stat_block("📍 Venue", f"{event.venue}, {event.city}")}
      {_stat_block("🟢 Starts", start_str)}
      {_stat_block("🛑 Ends", end_str)}
    </div>

    <p style="margin-bottom:8px;"><strong>Action Required:</strong></p>
    <p style="margin-top:0;">Please log in to your Utsavora ManagerProfile dashboard within 24 hours to review the details and formally <strong>Accept</strong> or <strong>Reject</strong> this booking request.</p>
    
    {_button("#", "View Booking Request")}
    """
    return base_email("New Booking Request", body)

def ManagerProfile_accepted_html(event):
    body = f"""
    <p style="margin-bottom:16px;">Great news! 🎊</p>

    <p style="margin-bottom:20px;">The ManagerProfile has officially <strong>accepted</strong> your request for:</p>

    <div style="background-color:#ffffff;border:2px solid {BRAND['secondary']};padding:20px;border-radius:12px;text-align:center;margin:30px 0;">
      <h3 style="color:{BRAND['primary']};margin:0;font-size:20px;">{event.title}</h3>
    </div>

    <p style="margin-bottom:12px;">Your event planning is right on track. You can now proceed to seamlessly complete the payment to guarantee your booking.</p>
    
    {_button("#", "Proceed to Payment")}
    """
    return base_email("ManagerProfile Accepted Request", body)

def payment_confirmed_html(event, amount):
    start_str = _format_datetime(event.start_date, event.start_time)
    end_str = _format_datetime(event.end_date, event.end_time)

    body = f"""
    <p style="margin-bottom:20px;">Your premium booking is now <strong>fully confirmed</strong>! ✅</p>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ecfdf5;border:1px solid #d1fae5;border-radius:12px;margin:30px 0;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <p style="color:#065f46;margin:0;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Payment Received</p>
          <p style="color:#064e3b;margin:0;font-size:28px;font-weight:900;">₹{amount}</p>
        </td>
      </tr>
    </table>

    <div style="background-color:#f9fafb;padding:24px;border-radius:12px;margin-bottom:20px;">
      {_stat_block("🎭 Event", event.title)}
      {_stat_block("📍 Venue", f"{event.venue}, {event.city}")}
      {_stat_block("🟢 Starts", start_str)}
      {_stat_block("🛑 Ends", end_str)}
    </div>

    <p style="margin-bottom:0;">Everything is locked in. We wish you a stunning and memorable celebration.</p>
    """
    return base_email("Payment & Booking Confirmed", body)

def public_registration_html(registration, event):
    start_str = _format_datetime(event.start_date, event.start_time)
    end_str = _format_datetime(event.end_date, event.end_time)

    body = f"""
    <p style="margin-bottom:16px;">Hello <strong>{registration.full_name}</strong>,</p>

    <p style="margin-bottom:24px;">You have successfully secured your spot! Your registration is confirmed for:</p>

    <div style="background-color:#ffffff;border:1px solid #e5e7eb;box-shadow:0 4px 6px rgba(0,0,0,0.02);padding:24px;border-radius:12px;margin:30px 0;">
      <h3 style="color:{BRAND['primary']};margin-top:0;margin-bottom:20px;font-size:22px;">{event.title}</h3>
      {_stat_block("📍 Venue", f"{event.venue}, {event.city}")}
      {_stat_block("🟢 Starts", start_str)}
      {_stat_block("🛑 Ends", end_str)}
    </div>

    <p style="margin-bottom:0;color:{BRAND['muted']};font-size:14px;background-color:#f9fafb;padding:16px;border-radius:8px;border-left:3px solid {BRAND['primary']};">
      <strong>Important:</strong> Please keep this email handy and present it at the entry gates if verification is required.
    </p>
    """
    return base_email("Registration Confirmed", body)

def event_completed_html(event):
     body = f"""
    <p style="margin-bottom:20px;">Your majestic event <strong>{event.title}</strong> has officially concluded. 🎊</p>
    
    <p style="margin-bottom:24px;">We hope the celebration was absolutely flawless and exactly as you envisioned.</p>

    <div style="background-color:{BRAND['secondary']};padding:24px;border-radius:12px;margin:30px 0;text-align:center;">
      <p style="margin:0;color:{BRAND['primary']};font-weight:700;font-size:18px;margin-bottom:12px;">Preserve the Magic</p>
      <p style="margin:0;color:{BRAND['text']};font-size:14px;line-height:1.5;">You and your guests can continue to upload beautiful memories, photos, and videos to your private event gallery for the next 10 days.</p>
    </div>
    
    {_button("#", "Upload Memories to Gallery")}
    """
     return base_email("Event Concluded Successfully", body)

def event_cancelled_html(event):
     body = f"""
    <p style="margin-bottom:20px;">We are writing to inform you that <strong>{event.title}</strong> has been officially marked as <strong style="color:#dc2626;">CANCELLED</strong>. ❌</p>
    
    <div style="background-color:#fef2f2;border:1px solid #fee2e2;padding:20px;border-radius:12px;margin:30px 0;">
      <p style="margin:0;color:#991b1b;font-size:15px;line-height:1.6;">If this cancellation was made in error or if you require an immediate reversal, please reach out to our emergency support team right away.</p>
    </div>
    
    <p style="margin-bottom:0;">All associated bookings, invitations, and ManagerProfile contracts tieing to this event have been frozen.</p>
    """
     return base_email("Important: Event Cancelled", body)
