import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import useRazorpay from "../../hooks/useRazorpay";

export default function PublicRegisterModal({ event, onClose }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        mobile: ""
    });
    const [loading, setLoading] = useState(false);
    const { displayRazorpay } = useRazorpay();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Registration
            const regRes = await api.post(`/events/public/register/${event.id}/`, formData);

            if (event.pricing_type === "FREE") {
                // DONE
                toast.success("Registration Successful! Check your email.");
                onClose();
            } else {
                // 2. PAID - Start Payment Flow
                const registrationId = regRes.data.registration_id;
                
                const orderRes = await api.post(`/events/public-payment/${registrationId}/order/`);
                const { order_id, amount, currency, razorpay_key } = orderRes.data;

                const options = {
                    key: razorpay_key,
                    amount: amount,
                    currency: currency,
                    name: event.title,
                    description: "Event Registration Fee",
                    order_id: order_id,
                    handler: async (response) => {
                        try {
                            await api.post('/events/public-payment/verify/', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            toast.success("Payment Successful! Registration Confirmed.");
                            onClose();
                        } catch (err) {
                            console.error(err);
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    },
                    prefill: {
                        name: formData.full_name,
                        email: formData.email,
                        contact: formData.mobile
                    },
                    theme: {
                        color: "#9333ea"
                    }
                };

                displayRazorpay(options);
            }

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.response?.data?.detail || "Registration failed.";
            toast.error(typeof msg === 'object' ? JSON.stringify(msg) : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold mb-4">Register for {event.title}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobile"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            {loading 
                                ? "Processing..." 
                                : (event.pricing_type === "FREE" ? "Confirm Free Registration" : `Proceed to Pay ₹${event.registration_fee}`)
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
