from django.urls import path
from .views import (
    initiate_payment, 
    confirm_payment,
    create_payment_order,
    verify_payment,
    initiate_fake_payment,
    admin_escrow_summary,
    admin_escrow_list,
    release_payment,
    refund_payment
)

urlpatterns = [
    # Razorpay Flows
    path("create-order/", create_payment_order),
    path("verify/", verify_payment),

    # Simplified Fake Payment
    path("pay/<int:booking_id>/", initiate_fake_payment),

    # Legacy/Internal Flows
    path("<int:booking_id>/pay/", initiate_payment),
    path("<int:booking_id>/confirm/", confirm_payment),
    
    # Admin Escrow Dashboard
    path("admin/escrow/summary/", admin_escrow_summary),
    path("admin/escrow/payments/", admin_escrow_list),
    path("admin/escrow/release/<int:payment_id>/", release_payment),
    path("admin/escrow/refund/<int:payment_id>/", refund_payment),
]
