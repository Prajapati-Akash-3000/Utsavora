import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import EventRegisterCard from "../../components/public/EventRegisterCard";
import RegistrationSuccess from "../../components/public/RegistrationSuccess";
import PageWrapper from "../../components/common/PageWrapper";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

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

  if (loading) return <Loader text="Loading event details..." />;
  
  if (error || !event) return (
      <div className="p-10">
        <EmptyState message={error || "Event not found"} />
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
        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="bg-white shadow-sm rounded-lg p-6 md:col-span-2 h-fit">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">{event.description}</p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center gap-2">
                <span>📍</span> 
                <span className="font-medium">{event.city}</span>
                {event.address_text && <span className="text-gray-400">({event.address_text})</span>}
            </div>
            <div className="flex items-center gap-2">
                <span>🗓</span>
                <span className="font-medium">{new Date(event.start_datetime).toLocaleString()}</span>
                <span>to</span>
                <span className="font-medium">{new Date(event.end_datetime).toLocaleString()}</span>
            </div>
            </div>
        </div>

        {/* Registration */}
        <div className="md:col-span-1">
            <div className="sticky top-6">
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
