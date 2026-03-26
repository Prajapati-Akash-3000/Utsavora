import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import InvitationStage from "../../invitations/engine/InvitationStage";
import InvitationRenderer from "../../invitations/engine/InvitationRenderer";
import Button from "../../components/ui/Button";
import { motion as Motion, AnimatePresence } from "framer-motion";
import TemplateSelector from "../../invitations/components/TemplateSelector";
import { templates } from "../../invitations/templates/templateData";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    venue: "",
    city: "",
    contact_numbers: "",
    description: "",
    is_public: true,
    visibility: "PRIVATE",
    pricing_type: "FREE",
    registration_fee: "",
    category: "",
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleInvalid = () => {
      setShake(true);
      setTimeout(() => setShake(false), 400);
  };

  useEffect(() => {
    api.get("/events/categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        invitation_template_key: selectedTemplate?.id ?? selectedTemplate?.key ?? "birthday"
      };
      const fee = payload.registration_fee;
      payload.registration_fee =
        payload.pricing_type === "PAID" && fee !== "" && fee != null
          ? Number(fee)
          : 0;

      const response = await api.post("/events/create/", payload);
      toast.success("Event created beautifully! ✨");
      navigate(`/user/event/${response.data.id}`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Reusable styling constants for premium UI
  const inputClass = "w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 px-5 py-4 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-400 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";
  const labelClass = "flex items-center text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1";
  
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* 🔮 HERO SECTION */}
      <div className="relative bg-[#050714] text-white pt-20 pb-40 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-indigo-600 rounded-[100%] blur-[120px]" 
          />
          <Motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-30%] right-[-10%] w-[45%] h-[60%] bg-fuchsia-600 rounded-[100%] blur-[140px]" 
          />
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <Motion.button 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/user/my-events')}
            className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-10 bg-white/5 py-2 px-5 rounded-full border border-white/10 hover:bg-white/10 backdrop-blur-md"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </Motion.button>
          
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-sm"
          >
            Create Event
          </Motion.h1>
          <Motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-6 text-lg sm:text-xl font-medium max-w-2xl"
          >
            Design your perfect invitation, configure the details, and launch an unforgettable experience for your guests.
          </Motion.p>
        </div>

        {/* Bottom smooth fade to content */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </div>

      {/* 📦 MAIN CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT: FORM SECTIONS (7 cols) */}
          <div className="xl:col-span-7 space-y-8">
            <Motion.form
              id="create-event-form"
              onSubmit={handleSubmit}
              onInvalid={handleInvalid}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className={shake ? "animate-[shake_0.4s_ease-in-out]" : ""}
            >
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-6px); }
                  50% { transform: translateX(6px); }
                  75% { transform: translateX(-4px); }
                }
              `}</style>
              <div className="space-y-8 lg:space-y-10">

                {/* 🏷️ STEP 1: EVENT DETAILS */}
                <Motion.div variants={fadeInUp} className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] hover:border-white">
                  {/* Decorative corner glow */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-center space-x-5 mb-10 relative">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)]">1</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Event Details</h2>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">The essentials for your upcoming gathering.</p>
                    </div>
                  </div>

                  <div className="space-y-7 relative">
                    {/* Title + Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>
                          <svg className="w-4 h-4 mr-2 text-indigo-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                          Event Title
                        </label>
                        <input type="text" name="title" required placeholder="e.g. Vikram's Wedding" className={inputClass} value={formData.title} onChange={handleChange} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          <svg className="w-4 h-4 mr-2 text-purple-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                          Category
                        </label>
                        <select name="category" required className={`${inputClass} appearance-none cursor-pointer`} value={formData.category} onChange={handleChange}>
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className={labelClass}>
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Start Date
                          </label>
                          <input type="date" name="start_date" required className={inputClass} value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Start Time
                          </label>
                          <input type="time" name="start_time" className={inputClass} value={formData.start_time} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className={labelClass}>
                            <svg className="w-4 h-4 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            End Date
                          </label>
                          <input type="date" name="end_date" required className={inputClass} value={formData.end_date} onChange={handleChange} />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <svg className="w-4 h-4 mr-2 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            End Time
                          </label>
                          <input type="time" name="end_time" className={inputClass} value={formData.end_time} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>
                          <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          Venue Name
                        </label>
                        <input type="text" name="venue" required placeholder="The Grand Palace" className={inputClass} value={formData.venue} onChange={handleChange} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          <svg className="w-4 h-4 mr-2 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          City
                        </label>
                        <input type="text" name="city" required placeholder="Mumbai" className={inputClass} value={formData.city} onChange={handleChange} />
                      </div>
                    </div>

                    {/* Contact & Desc */}
                    <div>
                      <label className={labelClass}>
                        <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        Contact Numbers
                      </label>
                      <input type="text" name="contact_numbers" placeholder="+91 9876543210" className={inputClass} value={formData.contact_numbers} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                        Description
                      </label>
                      <textarea name="description" rows="3" placeholder="Tell your guests what to expect..." className={`${inputClass} resize-none`} value={formData.description} onChange={handleChange} />
                    </div>
                  </div>
                </Motion.div>

                {/* ⚙️ STEP 2: EVENT SETTINGS */}
                <Motion.div variants={fadeInUp} className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] hover:border-white">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-center space-x-5 mb-10 relative">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center text-lg font-black shadow-[0_8px_20px_-6px_rgba(168,85,247,0.5)]">2</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Event Settings</h2>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">Control who can join and registration costs.</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-8 relative max-w-[36rem]">
                    {/* Visibility */}
                    <div>
                      <label className={labelClass}>
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        Visibility
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, visibility: 'PRIVATE' }))}
                          className={`relative flex-1 p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                            formData.visibility === 'PRIVATE'
                              ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_4px_15px_-3px_rgba(99,102,241,0.2)]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 z-10 relative">
                            <div className={`w-10 h-10 rounded-[0.85rem] flex items-center justify-center transition-colors ${formData.visibility === 'PRIVATE' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <div>
                              <p className={`text-sm font-black ${formData.visibility === 'PRIVATE' ? 'text-indigo-900' : 'text-slate-700'}`}>Private</p>
                              <p className={`text-[11px] font-medium mt-0.5 ${formData.visibility === 'PRIVATE' ? 'text-indigo-600/70' : 'text-slate-400'}`}>Invite only</p>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, visibility: 'PUBLIC' }))}
                          className={`relative flex-1 p-4 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                            formData.visibility === 'PUBLIC'
                              ? 'border-emerald-500 bg-emerald-50/50 shadow-[0_4px_15px_-3px_rgba(16,185,129,0.2)]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 z-10 relative">
                            <div className={`w-10 h-10 rounded-[0.85rem] flex items-center justify-center transition-colors ${formData.visibility === 'PUBLIC' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                              <p className={`text-sm font-black ${formData.visibility === 'PUBLIC' ? 'text-emerald-900' : 'text-slate-700'}`}>Public</p>
                              <p className={`text-[11px] font-medium mt-0.5 ${formData.visibility === 'PUBLIC' ? 'text-emerald-600/70' : 'text-slate-400'}`}>Open to all</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <AnimatePresence mode="popLayout">
                        {formData.visibility === 'PUBLIC' && (
                          <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                          >
                            <label className={labelClass}>
                              <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              Ticket Pricing
                            </label>
                            
                            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-4 border border-slate-200/50">
                              <button type="button" onClick={() => setFormData(prev => ({ ...prev, pricing_type: 'FREE' }))} className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${formData.pricing_type === 'FREE' ? 'bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}>
                                Free Entry
                              </button>
                              <button type="button" onClick={() => setFormData(prev => ({ ...prev, pricing_type: 'PAID' }))} className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${formData.pricing_type === 'PAID' ? 'bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}>
                                Paid Ticket
                              </button>
                            </div>

                            <AnimatePresence>
                              {formData.pricing_type === 'PAID' && (
                                <Motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="relative pt-1">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg mt-0.5">₹</span>
                                    <input type="number" name="registration_fee" min="1" required placeholder="500" className={`${inputClass} pl-12 text-lg font-bold text-indigo-950`} value={formData.registration_fee || ''} onChange={handleChange} />
                                  </div>
                                </Motion.div>
                              )}
                            </AnimatePresence>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Motion.div>

                {/* 🎨 STEP 3: TEMPLATE SELECTION */}
                <Motion.div variants={fadeInUp} className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] hover:border-white">
                  <div className="flex items-center space-x-5 mb-10">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center text-lg font-black shadow-[0_8px_20px_-6px_rgba(236,72,153,0.5)]">3</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Invitation Design</h2>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">Select a premium template for your event.</p>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
                    <TemplateSelector
                      selected={selectedTemplate}
                      onSelect={setSelectedTemplate}
                      categorySlug={categories.find((c) => String(c.id) === String(formData.category))?.slug}
                    />
                  </div>
                </Motion.div>

                {/* 🚀 SUBMIT BUTTON */}
                <Motion.div variants={fadeInUp} className="pt-4">
                  <div className="relative group rounded-[2.5rem] p-1.5 overflow-hidden">
                    {/* Animated gradient border / glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 blur-[10px] transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[gradient_4s_ease_infinite] bg-[length:200%_auto]" />
                     <style>{`
                        @keyframes gradient {
                          0% { background-position: 0% 50%; }
                          50% { background-position: 100% 50%; }
                          100% { background-position: 0% 50%; }
                        }
                      `}</style>
                    <Button
                      type="submit"
                      form="create-event-form"
                      loading={loading}
                      className="relative w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-[2rem] py-6 text-xl font-black tracking-wide border border-white/20 shadow-none transition-all duration-300 active:scale-[0.98]"
                    >
                      Publish Event
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-6">
                    Changes can be made safely after creation
                  </p>
                </Motion.div>

              </div>
            </Motion.form>
          </div>

          {/* RIGHT: LIVE PREVIEW (5 cols) */}
          <div className="xl:col-span-5 order-first xl:order-none mb-10 xl:mb-0">
            <Motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="xl:sticky top-8"
            >
              {/* Floating Device Frame */}
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-[3rem] p-4 sm:p-5 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] group hover:shadow-[0_30px_70px_-15px_rgba(99,102,241,0.2)] transition-shadow duration-500">
                
                {/* Device Inner Bezels */}
                <div className="relative bg-[#f1f3f5] rounded-[2.5rem] overflow-hidden border-2 border-slate-200/50 shadow-inner p-2 sm:p-3">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4 px-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white px-3 py-1 rounded-full shadow-sm">Live Preview</span>
                    </div>
                    <div className="w-8 opacity-0"></div> {/* balancer */}
                  </div>

                  {/* Stage Area */}
                  <div style={{width: "100%", height: "400px"}} className="w-full relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] bg-gradient-to-br from-white to-slate-50 rounded-[1.8rem] overflow-hidden aspect-[2/3] ring-1 ring-slate-900/5 transition-transform duration-500 group-hover:scale-[1.01]">
                    {/* Soft background glow dynamically colored based on template */}
                    {selectedTemplate && (
                       <Motion.div 
                          initial={false}
                          animate={{ backgroundColor: selectedTemplate.accent }}
                          className="absolute inset-0 opacity-10 blur-3xl pointer-events-none" 
                       />
                    )}
                    
                    <div style={{width: "100%", height: "100%"}} className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                      <AnimatePresence mode="wait">
                        <Motion.div
                          key={selectedTemplate?.id}
                          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
                          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                          exit={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
                          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} // smooth ease out
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div className="w-full h-full transform origin-center flex items-center justify-center rounded-[1rem] overflow-hidden shadow-sm">
                            <InvitationStage width={900} height={900}>
                              <InvitationRenderer template={selectedTemplate} data={formData} />
                            </InvitationStage>
                          </div>
                        </Motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Template Meta Tooltip (floating below) */}
                  {selectedTemplate && (
                    <div className="mt-4 mx-2 bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-100">
                      <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Active Template</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{selectedTemplate.name || selectedTemplate.id}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </Motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
