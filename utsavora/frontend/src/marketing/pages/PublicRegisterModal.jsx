import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import useRazorpay from "../../hooks/useRazorpay";
import MotionModal from "../../components/common/MotionModal";

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
                const { order_id, amount, currency } = orderRes.data;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
                            toast.error(handleApiError(err));
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
            toast.error(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <MotionModal isOpen={true} onClose={onClose}>
            <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6 relative border border-gray-100">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Register for {event.title}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition duration-200"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition duration-200"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
                        <input 
                            type="tel" 
                            name="mobile"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition duration-200"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {loading 
                                ? "Processing..." 
                                : (event.pricing_type === "FREE" ? "Confirm Free Registration" : `Proceed to Pay ₹${event.registration_fee}`)
                            }
                        </button>
                    </div>
                </form>
            </div>
        </MotionModal>
    );
}
