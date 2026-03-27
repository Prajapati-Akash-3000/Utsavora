from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_event),
    path("categories/", views.get_event_categories, name="get_event_categories"),
    
    # Public Routes (Must be before <int:id>)
    path('public/search/', views.search_public_events, name='search_public_events'),
    path('public/', views.public_events, name='public_events'),
    path('public/<int:event_id>/', views.get_public_event_detail, name='get_public_event_detail'),
    path('public/register/<int:event_id>/', views.register_public_event, name='register_public_event'),
    path('public-payment/<int:registration_id>/order/', views.create_public_payment_order, name='create_public_payment_order'),
    path('public-payment/verify/', views.verify_public_payment, name='verify_public_payment'),
    path('public/<int:event_id>/attendees/', views.public_attendee_list, name='public_attendee_list'),

    # Template Routes
    path('templates/', views.get_active_templates, name='get_active_templates'),
    path('templates/all/', views.get_all_templates, name='get_all_templates'),
    path('templates/create/', views.create_template, name='create_template'),
    path('templates/<int:pk>/update/', views.update_template, name='update_template'),
    path('templates/<int:pk>/toggle/', views.toggle_template, name='toggle_template'),
    
    # Packages
    path('packages/', views.public_packages, name='get_packages'), 

    # Specific Event Routes (Generic ID matches last)
    path('<int:id>/', views.event_detail, name='event_detail'),
    path('<int:id>/delete/', views.delete_event, name='delete_event'),
    path('<int:event_id>/media/upload/', views.upload_event_media, name='upload_event_media'),
    path('<int:event_id>/media/', views.get_event_media, name='get_event_media'),
    path('<int:event_id>/memory-limit/', views.get_memory_limit, name='get_memory_limit'),
    path('my-events/', views.my_events, name='my_events'), # my-events is static string, so safe before or after int:id? Wait. 'my-events/' is NOT an int. safe. But better to keep static routes top.
    
    path('<int:event_id>/invitation/', views.render_invitation, name='render_invitation'),
]
