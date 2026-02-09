import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import EventRegisterCard from "../../components/public/EventRegisterCard";
import RegistrationSuccess from "../../components/public/RegistrationSuccess";
import PageWrapper from "../../components/common/PageWrapper";
import { PageLoader } from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function PublicEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Determine if we should use public or private endpoint. 
    // Since this is PublicEventDetail, we try public first.
    // NOTE: Backend URL is /events/public/:id/
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

  if (loading) return <PageLoader />;
  
  if (error || !event) return (
      <div className="p-10 min-h-screen flex items-center justify-center">
        <EmptyState 
            title="Event Not Found" 
            message={error || "The event you are looking for does not exist or has been removed."}
            actionLabel="Browse Events"
            onAction={() => window.location.href = '/public/events'}
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

  return (
    <PageWrapper>
        {/* Hero Section */}
        <div className="relative h-64 md:h-96 w-full bg-purple-900 overflow-hidden">
            {event.template_details?.preview_image ? (
                <div className="absolute inset-0">
                    <img 
                        src={event.template_details.preview_image} 
                        alt="Event Cover" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900 opacity-90"></div>
            )}
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge status={event.pricing_type || "FREE"} className="bg-white/20 text-white border-none backdrop-blur-sm" />
                        <span className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                            {event.category || "General"}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">{event.title}</h1>
                    <p className="text-lg text-gray-200 flex items-center gap-2">
                        <span>🗓 {new Date(event.start_date || event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>📍 {event.city}</span>
                    </p>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8 -mt-10 relative z-20">
            {/* Event Info */}
            <div className="bg-white shadow-xl rounded-xl p-8 md:col-span-2 h-fit border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h2>
                <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {event.description || "No description provided."}
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <span className="text-xl">📍</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Location</h3>
                            <p className="text-gray-600">{event.venue}</p>
                            <p className="text-gray-500 text-sm mt-1">{event.city}</p>
                            {event.address_text && <p className="text-gray-500 text-sm">{event.address_text}</p>}
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <span className="text-xl">⏰</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Date & Time</h3>
                            <p className="text-gray-600">
                                {new Date(event.start_date || event.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                {new Date(event.start_date || event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration */}
            <div className="md:col-span-1">
                <div className="sticky top-24">
                   <EventRegisterCard
                       event={event}
                       onSuccess={() => setRegistered(true)}
                   />
                </div>
            </div>
        </div>
    </PageWrapper>
  );
}
