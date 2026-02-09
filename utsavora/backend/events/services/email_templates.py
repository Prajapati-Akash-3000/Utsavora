from datetime import datetime

BRAND = {
    "name": "Utsavora",
    "primary": "#6D28D9",   # purple-600
    "secondary": "#F3E8FF",
    "text": "#1F2937",
    "footer": "© Utsavora • Celebrate Moments"
}

def base_email(title, body_html):
    """
    Master template for all emails.
    """
    return f"""
    <div style="background:#f9fafb;padding:30px;font-family:Arial, sans-serif;line-height:1.6">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05)">
        
        <div style="background:{BRAND['primary']};color:white;padding:25px;text-align:center">
          <h1 style="margin:0;font-size:24px;font-weight:bold;letter-spacing:1px">{BRAND['name']}</h1>
        </div>

        <div style="padding:40px 30px;color:{BRAND['text']}">
          <h2 style="margin-top:0;color:{BRAND['primary']};font-size:20px;margin-bottom:20px">{title}</h2>
          {body_html}
        </div>

        <div style="background:#f3f4f6;padding:20px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb">
          <p style="margin:0">{BRAND['footer']}</p>
        </div>

      </div>
    </div>
    """

def event_created_html(event):
    body = f"""
    <p>Your event <strong>{event.title}</strong> has been created successfully 🎉</p>

    <div style="background:{BRAND['secondary']};padding:15px;border-radius:8px;margin:20px 0;">
      <p style="margin:5px 0;"><strong>📅 Date:</strong> {event.start_date}</p>
      <p style="margin:5px 0;"><strong>📍 Venue:</strong> {event.venue}, {event.city}</p>
    </div>

    <p>You can manage invitations, hire managers, and track progress anytime from your dashboard.</p>
    
    <div style="text-align:center;margin-top:30px;">
        <a href="#" style="background:{BRAND['primary']};color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Event Dashboard</a>
    </div>
    """
    return base_email("Event Created Successfully", body)

def manager_request_html(manager, event):
    # Added missing template from plan based on usage in service
    body = f"""
    <p>Hello {manager.full_name},</p>
    
    <p>You have received a new booking request! 📋</p>
    
    <div style="background:{BRAND['secondary']};padding:15px;border-radius:8px;margin:20px 0;">
      <p style="margin:5px 0;"><strong>🎭 Event:</strong> {event.title}</p>
      <p style="margin:5px 0;"><strong>📅 Date:</strong> {event.start_date}</p>
      <p style="margin:5px 0;"><strong>📍 Venue:</strong> {event.venue}, {event.city}</p>
    </div>

    <p>Please log in to your dashboard to review and accept/reject this request.</p>
    
    <div style="text-align:center;margin-top:30px;">
        <a href="#" style="background:{BRAND['primary']};color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">View Request</a>
    </div>
    """
    return base_email("New Event Request", body)

def manager_accepted_html(event):
    body = f"""
    <p>Good news! 🎊</p>

    <p>The manager has accepted your request for:</p>

    <h3 style="color:{BRAND['primary']};margin:10px 0;">{event.title}</h3>

    <p>You can now proceed with payment to confirm your booking.</p>
    
    <div style="text-align:center;margin-top:30px;">
        <a href="#" style="background:{BRAND['primary']};color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Proceed to Payment</a>
    </div>
    """
    return base_email("Manager Accepted Request", body)

def payment_confirmed_html(event, amount):
    body = f"""
    <p>Your booking is now <strong>confirmed</strong> ✅</p>

    <div style="background:#ecfdf5;border:1px solid #d1fae5;color:#065f46;padding:15px;border-radius:8px;margin:20px 0;">
      <p style="margin:0;font-weight:bold;">Payment Received: ₹{amount}</p>
    </div>

    <p>
      <strong>Event:</strong> {event.title}<br>
      <strong>Dates:</strong> {event.start_date}
    </p>

    <p>We wish you a memorable celebration!</p>
    """
    return base_email("Booking Confirmed", body)

def public_registration_html(registration, event):
    body = f"""
    <p>Hello {registration.full_name},</p>

    <p>You are successfully registered for:</p>

    <h3 style="color:{BRAND['primary']};margin:15px 0;">{event.title}</h3>

    <div style="background:{BRAND['secondary']};padding:15px;border-radius:8px;margin:20px 0;">
      <p style="margin:5px 0;"><strong>📍 Venue:</strong> {event.venue}, {event.city}</p>
      <p style="margin:5px 0;"><strong>📅 Date:</strong> {event.start_date}</p>
    </div>

    <p>Please show this email at the entry if required.</p>
    """
    return base_email("Registration Confirmed", body)

def event_completed_html(event):
     body = f"""
    <p>Your event <strong>{event.title}</strong> is now completed 🎊</p>
    
    <p>We hope it was a memorable celebration!</p>

    <p>You can still upload memories to your event gallery for the next 10 days.</p>
    
    <div style="text-align:center;margin-top:30px;">
        <a href="#" style="background:{BRAND['primary']};color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Upload Memories</a>
    </div>
    """
     return base_email("Event Completed", body)

def event_cancelled_html(event):
     body = f"""
    <p>Your event <strong>{event.title}</strong> has been marked as <strong>CANCELLED</strong> ❌</p>
    
    <p>If this was a mistake, please contact support immediately.</p>
    """
     return base_email("Event Cancelled", body)
