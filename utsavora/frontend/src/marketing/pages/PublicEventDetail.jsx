import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { motion as Motion } from "framer-motion";
import { Calendar, MapPin, Clock, Info, ShieldCheck, Share2 } from "lucide-react";
import EventRegisterCard from "../../marketing/sections/EventRegisterCard";
import RegistrationSuccess from "../../marketing/sections/RegistrationSuccess";
import PageWrapper from "../../components/common/PageWrapper";
import { PageLoader } from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import toast from "react-hot-toast";

export default function PublicEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/events/public/${id}/`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Event not found or private.");
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
        navigator.share({
            title: event?.title,
            text: `Check out ${event?.title} on Utsavora!`,
            url: window.location.href,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <PageLoader />;
  
  if (error || !event) return (
      <div className="p-10 min-h-screen flex items-center justify-center bg-slate-50">
        <EmptyState 
            title="Event Not Found" 
            message={error || "The event you are looking for does not exist or has been removed."}
            actionLabel="Browse Events"
            onAction={() => window.location.href = '/events'}
            icon="search"
        />
      </div>
  );

  if (registered) {
    return (
        <PageWrapper>
            <RegistrationSuccess event={event} />
        </PageWrapper>
    );
  }

  const startDate = new Date(event.start_date || event.date);
  const isFree = event.pricing_type === "FREE";

  return (
    <PageWrapper className="bg-slate-50 min-h-screen">
        {/* Immersive Hero Section */}
        <div className="relative h-[60vh] min-h-[500px] w-full bg-[#080b14] overflow-hidden">
            {event.template_details?.preview_image ? (
                <Motion.div 
                    initial={{ opacity: 0, scale: 1.05 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img 
                        src={event.template_details.preview_image} 
                        alt={event.title} 
                        className="w-full h-full object-cover opacity-70 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-[#080b14]/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080b14]/80 to-transparent"></div>
                </Motion.div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary-900 to-[#080b14]"></div>
            )}
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
                <div className="max-w-7xl mx-auto">
                    <Motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-xl">
                                {event.category || "General"}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-xl ${isFree ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-primary/20 border-primary/30 text-primary-300'}`}>
                                {isFree ? "Free Entry" : "Paid Event"}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-primary-400" />
                                <span>{startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            {event.start_time && (
                                <>
                                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-purple-400" />
                                        <span>
                                            {event.start_time.slice(0, 5)} {event.end_time ? `to ${event.end_time.slice(0, 5)}` : ''}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-indigo-400" />
                                <span>{event.city}</span>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Info className="text-primary" />
                            About this Event
                        </h2>
                        <button 
                            onClick={handleShare}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                            title="Share Event"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line prose-a:text-primary hover:prose-a:text-indigo-600">
                        {event.description || "No specific details have been provided for this event yet."}
                    </div>
                </Motion.div>

                {/* Event Highlights/Details Grid */}
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                            <MapPin className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Location Details</h3>
                            <p className="text-slate-600 font-medium">{event.venue}</p>
                            <p className="text-slate-500 text-sm mt-0.5">{event.city}</p>
                            {event.address_text && <p className="text-slate-500 text-sm mt-2">{event.address_text}</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                            <Clock className="text-primary-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Date & Time</h3>
                            <p className="text-slate-600 font-medium">
                                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-slate-500 text-sm mt-0.5">
                                {event.start_time ? `Starts at ${event.start_time.slice(0, 5)}` : `Starts at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                {event.end_time ? ` - Ends at ${event.end_time.slice(0, 5)}` : ""}
                            </p>
                        </div>
                    </div>
                </Motion.div>
                
                {/* Security Trust Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-4">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Secure Registration powered by Utsavora</span>
                </div>

            </div>

            {/* Sidebar / Dynamic Registration Card */}
            <div className="lg:col-span-4">
                <Motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="sticky top-28"
                >
                   <EventRegisterCard
                       event={event}
                       onSuccess={() => setRegistered(true)}
                   />
                </Motion.div>
            </div>

        </div>
    </PageWrapper>
  );
}
