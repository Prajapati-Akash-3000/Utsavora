import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function PublicEventLanding() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/public/${eventId}/`)
      .then(res => setEvent(res.data))
      .catch((err) => {
          console.error(err);
          toast.error("Event not found or invalid.");
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5B5FFF]"></div>
          </div>
      );
  }

  if (!event) return null;

  const bgImage = event.template_details?.preview_image || event.template_details?.background_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      {/* HEADER / BANNER */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="relative h-[320px] w-full overflow-hidden rounded-[24px] shadow-lg">
              <img 
                src={bgImage} 
                alt="Event Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <div className="text-center text-white px-4">
                     <h1 className="text-4xl md:text-5xl font-black mb-4 shadow-sm tracking-tight">{event.title}</h1>
                     <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-medium shadow-sm">
                        <Calendar size={20} />
                        <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        <span className="mx-2">|</span>
                        <MapPin size={20} />
                        <span>{event.city}</span>
                     </div>
                 </div>
              </div>
          </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-12">
                  <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-6 font-sans tracking-tight">About Event</h3>
                      <div className="prose text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                          {event.description || "No description provided."}
                      </div>
                  </div>
              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 sticky top-24">
                      
                      <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 mb-8">
                          <div className="flex items-start gap-4">
                              <div className="bg-[#5B5FFF]/10 p-3 rounded-xl text-[#5B5FFF]">
                                  <Calendar size={24} />
                              </div>
                              <div>
                                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Date & Time</p>
                                  <p className="text-slate-900 font-bold text-lg">{new Date(event.start_date).toLocaleDateString()}</p>
                                  {(event.start_time || event.end_time) && (
                                      <p className="text-sm text-slate-600 font-medium mt-0.5">
                                          {event.start_time ? `Starts at ${event.start_time.slice(0, 5)}` : ""}
                                          {event.end_time && event.start_time ? ` to ${event.end_time.slice(0, 5)}` : ""}
                                          {event.end_time && !event.start_time ? `Ends at ${event.end_time.slice(0, 5)}` : ""}
                                      </p>
                                  )}
                                  {event.end_date && event.end_date !== event.start_date && (
                                      <p className="text-sm text-slate-600 font-medium mt-1">Ends {new Date(event.end_date).toLocaleDateString()}</p>
                                  )}
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <div className="bg-[#5B5FFF]/10 p-3 rounded-xl text-[#5B5FFF]">
                                   <MapPin size={24} />
                              </div>
                              <div>
                                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
                                  <p className="text-slate-900 font-bold text-lg leading-tight">{event.venue}</p>
                                  <p className="text-sm text-slate-600 font-medium mt-1">{event.city}</p>
                              </div>
                          </div>
                      </div>

                      {/* PRICING & ACTION */}
                      <div className="space-y-6">
                          <div className="flex items-center justify-between">
                              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Ticket Price</p>
                              {event.pricing_type === "FREE" ? (
                                  <span className="text-3xl font-black text-emerald-500">Free</span>
                              ) : (
                                  <span className="text-3xl font-black text-slate-900">₹{event.registration_fee}</span>
                              )}
                          </div>

                          <button
                            disabled={!event.is_registration_open}
                            onClick={() => navigate(`/public/events/${event.id}/register`)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                event.is_registration_open 
                                ? "bg-[#5B5FFF] text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1" 
                                : "bg-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                             {event.is_registration_open ? "Register Now" : "Registration Closed"}
                          </button>
                      </div>

                      <div className="text-center mt-6 text-slate-400 text-sm font-medium">
                          Secure event powered by <span className="font-bold text-slate-600">Utsavora</span>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}
