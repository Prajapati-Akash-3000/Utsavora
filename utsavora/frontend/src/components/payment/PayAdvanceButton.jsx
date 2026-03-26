import api from "../../services/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import { useState } from "react";
import Button from "../ui/Button";
import { motion as Motion } from "framer-motion";

export default function PayAdvanceButton({ bookingId }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
        const res = await api.post(
            "/payments/create-order/",
            { booking_id: bookingId }
        );
        
        if (!res.data || !res.data.order_id) {
            toast.error("Failed to create payment order. Please try again.");
            setLoading(false);
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: res.data.amount,
            currency: "INR",
            name: "Utsavora Events",
            description: "Booking Advance Payment",
            order_id: res.data.order_id,
            handler: async function (response) {
                try {
                    await api.post("/payments/verify/", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    setSuccess(true);
                    setLoading(false);
                    toast.success("Payment successful! Your booking is confirmed.");
                    setTimeout(() => window.location.reload(), 1500);
                } catch (verifyErr) {
                    setLoading(false);
                    toast.error(handleApiError(verifyErr));
                }
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            },
            prefill: {
                name: "", 
                email: "",
                contact: ""
            },
            theme: {
                color: "#16a34a" 
            }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response){
            setLoading(false);
            toast.error("Payment failed: " + response.error.description);
        });

        rzp.open();

    } catch (err) {
        setLoading(false);
        toast.error(handleApiError(err));
    }
  };

  return (
    <Button
      onClick={pay}
      loading={loading}
      disabled={success}
      className={`px-6 py-2 font-semibold shadow-md ${success ? 'bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
    >
      {success ? (
          <Motion.span 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2"
          >
            ✅ Confirmed
          </Motion.span>
      ) : "Pay Now"}
    </Button>
  );
}
