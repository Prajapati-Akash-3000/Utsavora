import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Calendar, MapPin, CheckCircle, Phone, Lock } from "lucide-react";
import toast from "react-hot-toast";

// Load Razorpay Script
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PublicEventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
      full_name: "",
      email: "",
      mobile: ""
  });

  useEffect(() => {
    api.get(`/events/public/${id}/`)
      .then(res => setEvent(res.data))
      .catch(err => {
          console.error(err);
          toast.error("Event not found");
          // navigate("/public/events");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
          // 1. Initialize Registration
          const res = await api.post(`/events/public/register/${id}/`, form);
          
          if (res.data.razorpay_order_id) {
              // PAID FLOW
              const isLoaded = await loadRazorpay();
              if (!isLoaded) {
                  toast.error("Razorpay SDK failed to load");
                  setSubmitting(false);
                  return;
              }

              const options = {
                  key: res.data.key_id,
                  amount: res.data.amount,
                  currency: res.data.currency,
                  name: "Utsavora Events",
                  description: `Registration for ${event.title}`,
                  order_id: res.data.razorpay_order_id,
                  handler: async function (response) {
                      try {
                        const verifyRes = await api.post("/events/public/payment/verify/", {
                            registration_id: res.data.registration_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        if (verifyRes.data.success) {
                            toast.success("Registration Confirmed! 🎉");
                            // navigate("/public/registration-success"); // Or stay and show success state
                            setEvent(prev => ({ ...prev, is_registered: true })); // Simple local state toggle if needed
                            navigate(0); // Reload to show success/block duplicate
                        }
                      } catch (verifyErr) {
                          toast.error("Payment Verification Failed");
                          console.error(verifyErr);
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

              const rzp = new window.Razorpay(options);
              rzp.open();

          } else {
              // FREE FLOW
              toast.success("Registration Successful! 🎟️");
              setForm({ full_name: "", email: "", mobile: "" });
          }

      } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.error || "Registration failed");
      } finally {
          setSubmitting(false);
      }
  };

  if (loading) return <div className="text-center p-10 text-gray-500">Loading event...</div>;
  if (!event) return <div className="text-center p-10 text-red-500">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        
        {/* Banner */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="h-64 bg-purple-100 relative">
                 {event.template_details?.background_image ? (
                     <img src={event.template_details.background_image} alt="Cover" className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
                         <h1 className="text-4xl text-white font-bold opacity-20">{event.title}</h1>
                     </div>
                 )}
                 <div className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                     {event.pricing_type === 'PAID' ? `Entry: ₹${event.registration_fee}` : 'Free Entry'}
                 </div>
            </div>
            
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">{event.description || "Join us for this amazing event!"}</p>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-t pt-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-700 capitalize">
                            {event.start_date} {event.end_date && ` - ${event.end_date}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-700">{event.venue}, {event.city}</span>
                    </div>
                    {event.contact_numbers && (
                         <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700">{event.contact_numbers}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Register Form */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Secure Your Spot</h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                    <input 
                        type="text" 
                        name="full_name"
                        required 
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        value={form.full_name}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        required 
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
                    <input 
                        type="tel" 
                        name="mobile"
                        required 
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        value={form.mobile}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                        <span>Registration Fee</span>
                        <span className="font-bold text-gray-800 text-lg">
                             {event.pricing_type === 'PAID' ? `₹${event.registration_fee}` : 'Free'}
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? "Processing..." : (
                            <>
                                {event.pricing_type === 'PAID' ? <Lock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                {event.pricing_type === 'PAID' ? "Pay & Register" : "Register Now"}
                            </>
                        )}
                    </button>
                    
                    <p className="text-xs text-center text-gray-400 mt-4">
                        Secure payment powered by Razorpay. Ticket sent via email.
                    </p>
                </div>
            </form>
        </div>

    </div>
  );
}
