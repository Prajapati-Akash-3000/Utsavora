from django.urls import path
from .views import (
    initiate_payment, 
    confirm_payment,
    create_payment_order,
    verify_payment,
    admin_finance_summary,
    admin_transactions,
    release_payment,
    refund_payment
)

urlpatterns = [
    # Razorpay Flows
    path("<int:booking_id>/create-order/", create_payment_order),
    path("verify/", verify_payment),

    # Legacy/Internal Flows
    path("<int:booking_id>/pay/", initiate_payment),
    path("<int:booking_id>/confirm/", confirm_payment),
    
    # Admin Finance
    path("admin/summary/", admin_finance_summary),
    path("admin/transactions/", admin_transactions),
    path("admin/<int:payment_id>/release/", release_payment),
    path("admin/<int:payment_id>/refund/", refund_payment),
]
