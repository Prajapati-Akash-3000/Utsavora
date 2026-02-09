import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

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
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
      );
  }

  if (!event) return null;

  const bgImage = event.template_details?.preview_image || event.template_details?.background_image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER / BANNER */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          <img 
            src={bgImage} 
            alt="Event Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
             <div className="text-center text-white px-4">
                 <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">{event.title}</h1>
                 <p className="text-lg md:text-xl opacity-90 shadow-sm">{new Date(event.start_date).toLocaleDateString()} | {event.city}</p>
             </div>
          </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 py-8 -mt-16 relative z-10">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                  
                  {/* META INFO GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                      <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                          <div>
                              <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                              <p className="text-gray-900 font-semibold">{new Date(event.start_date).toLocaleDateString()}</p>
                              {event.end_date !== event.start_date && (
                                  <p className="text-xs text-gray-500">to {new Date(event.end_date).toLocaleDateString()}</p>
                              )}
                          </div>
                      </div>

                      <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </div>
                          <div>
                              <p className="text-sm text-gray-500 font-medium">Location</p>
                              <p className="text-gray-900 font-semibold">{event.venue}</p>
                              <p className="text-sm text-gray-600">{event.city}</p>
                          </div>
                      </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">About Event</h3>
                      <div className="prose text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {event.description || "No description provided."}
                      </div>
                  </div>

                  {/* PRICING & ACTION */}
                  <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100 mt-6">
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Ticket Price</p>
                          {event.pricing_type === "FREE" ? (
                              <span className="text-2xl font-bold text-green-600">Free Entry</span>
                          ) : (
                              <span className="text-2xl font-bold text-gray-900">₹{event.registration_fee}</span>
                          )}
                      </div>

                      <button
                        disabled={!event.is_registration_open}
                        onClick={() => navigate(`/public/events/${event.id}/register`)}
                        className={`px-8 py-3 rounded-lg font-bold shadow-md transition transform active:scale-95 ${
                            event.is_registration_open 
                            ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                         {event.is_registration_open ? "Register Now" : "Registration Closed"}
                      </button>
                  </div>
              </div>
          </div>
          
          <div className="text-center mt-8 text-gray-400 text-sm">
              Event powered by <span className="font-bold text-gray-500">Utsavora</span>
          </div>
      </div>
    </div>
  );
}
