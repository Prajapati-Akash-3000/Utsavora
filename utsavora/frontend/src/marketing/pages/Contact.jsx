import { useState } from "react";
import { motion as Motion } from "framer-motion";
import api from "../../services/api";
import { Mail, MapPin, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2, Send, ArrowUpRight } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
});

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@utsavora.com",
    href: "mailto:support@utsavora.com",
    gradient: "from-indigo-500 to-blue-600",
    bgGlow: "bg-indigo-500/20",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 98765 43210",
    href: "tel:+919876543210",
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/20",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Ahmedabad, India",
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/20",
  },
];

/* Floating Label Input Component */
function FloatingInput({ label, type = "text", value, onChange, required = true }) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full border-2 border-slate-200 bg-white p-4 pt-6 rounded-2xl
                   focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                   transition-all duration-300 text-slate-900 font-medium placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-base
                   transition-all duration-300 pointer-events-none
                   peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest
                   peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-slate-500"
      >
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ label, value, onChange, required = true }) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="relative group">
      <textarea
        id={id}
        rows="5"
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full border-2 border-slate-200 bg-white p-4 pt-7 rounded-2xl
                   focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                   transition-all duration-300 text-slate-900 font-medium min-h-[160px] resize-none placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-5 text-slate-400 font-medium text-base
                   transition-all duration-300 pointer-events-none
                   peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-indigo-600 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest
                   peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-slate-500"
      >
        {label}
      </label>
    </div>
  );
}


export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/contact/", {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: "New Contact Form Inquiry",
        message: formData.message,
      });
      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-slate-50">
      {/* Immersive Header */}
      <section className="relative w-full pt-24 pb-40 bg-[#080b14] overflow-hidden text-center px-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <Motion.div {...fadeUp()} className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <MessageSquare size={14} className="text-indigo-400" />
            <span>Get in touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-6 leading-tight">
            Let's create something <br/>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">unforgettable.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto">
            Have a question, a partnership idea, or just want to say hi? We'd love to hear from you.
          </p>
        </Motion.div>
      </section>

      {/* Contact Cards - Overlapping Header */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white rounded-[28px] p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 text-center overflow-hidden"
              >
                {/* Hover Glow */}
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 ${card.bgGlow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                {card.href ? (
                  <a href={card.href} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center justify-center gap-1.5 group/link">
                    {card.detail}
                    <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-slate-500 font-medium">{card.detail}</span>
                )}
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 pb-32 relative z-10">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 md:p-12 lg:p-16 rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="text-center mb-10">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Send us a message</h3>
            <p className="text-slate-500 font-medium">We typically reply within 24 hours</p>
          </div>

          {status === "success" && (
            <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 bg-emerald-50 text-emerald-700 p-5 rounded-2xl border border-emerald-200 font-bold flex items-center gap-3 text-sm">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              Message sent successfully! We'll be in touch shortly.
            </Motion.div>
          )}
          {status === "error" && (
            <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-200 font-bold flex items-center gap-3 text-sm">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              Something went wrong. Please try again.
            </Motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              <FloatingInput 
                label="First Name" 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
              />
              <FloatingInput 
                label="Last Name" 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
              />
            </div>
            <FloatingInput 
              label="Email Address" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
            <FloatingTextarea 
              label="Your Message" 
              value={formData.message} 
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full relative group overflow-hidden bg-slate-900 text-white py-4.5 mt-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                {status === "submitting" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0" />
            </button>

            <p className="text-xs text-slate-400 text-center font-medium pt-2">
              By submitting, you agree to our <a href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </Motion.div>
      </div>
    </PageWrapper>
  );
}
