import api from "../../services/api";
import toast from "react-hot-toast";

export default function PayAdvanceButton({ bookingId }) {
  const pay = async () => {
    try {
        const res = await api.post(
            "/payments/create-order/",
            { booking_id: bookingId }
        );
        
        if (!res.data || !res.data.order_id) {
            toast.error("Failed to create payment order. Please try again.");
            return;
        }

        const options = {
            key: res.data.key, // Ensure backend returns 'key' not 'razorpay_key' if changed, checked view, it returns 'key'
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
                    toast.success("Payment successful! Your booking is confirmed.");
                    window.location.reload();
                } catch (verifyErr) {
                    console.error("Verification failed", verifyErr);
                    toast.error("Payment verification failed. Please contact support.");
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
            toast.error("Payment failed: " + response.error.description);
        });

        rzp.open();

    } catch (err) {
        console.error("Payment init error", err);
        toast.error("Could not initiate payment. " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <button
      onClick={pay}
      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
    >
      Pay Now
    </button>
  );
}
