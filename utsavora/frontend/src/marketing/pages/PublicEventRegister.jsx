import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import useRazorpay from "../../hooks/useRazorpay";
import { motion as Motion } from "framer-motion";
import { ShieldCheck, Calendar, MapPin, CheckCircle, ArrowLeft, CreditCard } from "lucide-react";

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

    useEffect(() => {
        api.get(`/events/public/${eventId}/`)
          .then(res => setEvent(res.data))
          .catch(() => {
              toast.error("Event not found");
              navigate("/events");
          });
    }, [eventId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await api.post(`/events/public/register/${eventId}/`, { 
                ...form, 
                event: eventId 
            });

            if (res.data.status === "CONFIRMED") {
                toast.success("Registered successfully! Check your email.");
                navigate(`/public/events/${eventId}`);
            } 
            else if (res.data.status === "PAYMENT_REQUIRED") {
                const registrationId = res.data.registration_id;
                const orderRes = await api.post(`/events/public-payment/${registrationId}/order/`);
                const { order_id, amount, currency } = orderRes.data;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
                            toast.error(handleApiError(err));
                        }
                    },
                    prefill: {
                        name: form.full_name,
                        email: form.email,
                        contact: form.mobile
                    },
                    theme: {
                        color: "#5B5FFF"
                    }
                };

                displayRazorpay(options);
            }

        } catch (err) {
            toast.error(handleApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (!event) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const isFree = event.pricing_type === 'FREE';

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            
            {/* Left Side: Context / Order Summary */}
            <div className="w-full lg:w-[45%] bg-[#080b14] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                {/* Background Image / Gradient */}
                {event.template_details?.preview_image && (
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={event.template_details.preview_image} 
                            alt="" 
                            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-[#080b14]/80 to-transparent" />
                    </div>
                )}
                
                <div className="relative z-10 flex flex-col h-full">
                    <div>
                        <button 
                            onClick={() => navigate(`/public/events/${eventId}`)}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Event</span>
                        </button>

                        <Motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 backdrop-blur-md">
                                Registration Checkout
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {event.title}
                            </h1>
                            
                            <div className="space-y-3 text-slate-300 text-sm md:text-base mt-8">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Calendar className="text-primary-400 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-white">Date & Time</p>
                                        <p>
                                            {new Date(event.start_date || event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            {event.start_time ? ` at ${event.start_time.slice(0, 5)}` : ""}
                                            {event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <MapPin className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-white">Location</p>
                                        <p>{event.venue}</p>
                                        <p className="text-slate-400 text-sm">{event.city}</p>
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-lg text-slate-400 font-medium">Total Amount</span>
                            <span className="text-3xl font-black text-white">
                                {isFree ? "Free" : `₹${event.registration_fee}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-medium">
                            <ShieldCheck size={16} />
                            <span>100% Secure Transaction</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[55%] p-8 lg:p-16 flex items-center justify-center relative bg-slate-50">
                <Motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-lg bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-slate-100"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Attendee Details</h2>
                        <p className="text-slate-500">Please provide your valid details to receive your ticket and event updates.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <input
                                className="w-full border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="Enter your full name"
                                value={form.full_name}
                                onChange={e => setForm({...form, full_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <input
                                className="w-full border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                type="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                required
                            />
                            <p className="text-xs text-slate-500 ml-1">Your ticket will be sent to this email.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
                            <input
                                className="w-full border border-slate-200 bg-slate-50/50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                type="tel"
                                placeholder="(+91) 98765 43210"
                                value={form.mobile}
                                onChange={e => setForm({...form, mobile: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="pt-6">
                            <button 
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B5FFF] to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-[#5B5FFF]/25 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : isFree ? (
                                    <>
                                        <CheckCircle size={20} />
                                        Complete Registration
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Proceed to Pay ₹{event.registration_fee}
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                By proceeding, you agree to our Terms of Service and Privacy Policy. All sales are final unless otherwise stated by the organizer.
                            </p>
                        </div>
                    </form>
                </Motion.div>
            </div>
            
        </div>
    );
}
