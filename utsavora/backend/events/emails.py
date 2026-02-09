def event_created_email(event):
    return (
        "🎉 Event Created Successfully!",
        f"""
Your event "{event.title}" has been created.

📅 Dates: {event.start_date} → {event.end_date}
📍 Venue: {event.venue}, {event.city}

You can now hire a manager and customize your event.

— Utsavora Team
"""
    )


def manager_accepted_email(event):
    return (
        "✅ Manager Accepted Your Event",
        f"""
Good news!

Your manager has accepted the request for:
📌 {event.title}

You can now proceed with payment and uploads.

— Utsavora
"""
    )


def event_completed_email(event):
    return (
        "🎊 Event Completed – Thank You!",
        f"""
Your event "{event.title}" is now completed.

You can still upload memories for the next 10 days.

Thank you for choosing Utsavora ❤️
"""
    )
