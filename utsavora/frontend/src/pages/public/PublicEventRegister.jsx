import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Using configured axios instance
import toast from "react-hot-toast";
import useRazorpay from "../../hooks/useRazorpay";

export default function PublicEventRegister() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const { displayRazorpay } = useRazorpay();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        mobile: ""
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Event Details to show title/price
    useEffect(() => {
        api.get(`/events/public/${eventId}/`)
          .then(res => setEvent(res.data))
          .catch(() => {
              toast.error("Event not found");
              navigate("/public/events");
          });
    }, [eventId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Create Registration
            // We send 'event: eventId' as requested, though backend handles injection too.
            const res = await api.post(`/events/public/register/${eventId}/`, { 
                ...form, 
                event: eventId 
            });

            // 2. Handle Response
            // Backend returns { status: "CONFIRMED" } for Free
            if (res.data.status === "CONFIRMED") {
                toast.success("Registered successfully! Check your email.");
                navigate(`/public/events/${eventId}`);
            } 
            // Backend returns { status: "PAYMENT_REQUIRED", registration_id: ... } for Paid
            else if (res.data.status === "PAYMENT_REQUIRED") {
                const registrationId = res.data.registration_id;
                
                // 3. Initiate Razorpay Order
                const orderRes = await api.post(`/events/public-payment/${registrationId}/order/`);
                const { order_id, amount, currency, razorpay_key } = orderRes.data;

                const options = {
                    key: razorpay_key,
                    amount: amount,
                    currency: currency,
                    name: event?.title || "Event Registration",
                    description: "Registration Fee",
                    order_id: order_id,
                    handler: async (response) => {
                        try {
                            await api.post('/events/public-payment/verify/', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            toast.success("Payment Successful! Registration Confirmed.");
                            navigate(`/public/events/${eventId}`);
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: form.full_name,
                        email: form.email,
                        contact: form.mobile
                    },
                    theme: {
                        color: "#9333ea"
                    }
                };

                displayRazorpay(options);
            }

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || "Registration failed";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!event) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-center">Register for {event.title}</h2>
                <p className="text-center text-gray-500 mb-6">
                    {event.pricing_type === 'FREE' 
                        ? <span className="text-green-600 font-bold">Free Event</span> 
                        : <span className="text-purple-600 font-bold">Fee: ₹{event.registration_fee}</span>}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={e => setForm({...form, full_name: e.target.value})}
                        required
                    />
                    <input
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                    />
                    <input
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        type="tel"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={e => setForm({...form, mobile: e.target.value})}
                        required
                    />
                    
                    <button 
                        disabled={submitting}
                        className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Processing..." : (event.pricing_type === 'FREE' ? "Confirm Registration" : "Proceed to Pay")}
                    </button>
                </form>

                <button 
                    onClick={() => navigate(`/public/events/${eventId}`)}
                    className="w-full mt-4 text-gray-500 text-sm hover:underline text-center block"
                >
                    Cancel / Back to Event
                </button>
            </div>
        </div>
    );
}
