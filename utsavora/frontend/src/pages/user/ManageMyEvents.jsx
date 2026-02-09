import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Loading";

export default function ManageMyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events/my-events/")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  if (events.length === 0) {
    return (
      <EmptyState 
        title="No events found"
        message="You haven't created any events yet."
        actionLabel="Create Event"
        onAction={() => navigate("/user/create-event")}
        icon="calendar"
        className="mt-10 mx-auto max-w-lg"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Link to="/user/create-event">
            <Button>+ New Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link to={`/user/event/${event.id}`} key={event.id} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition h-full flex flex-col">
              <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                  <div className="absolute bottom-2 right-2">
                       <Badge status={event.status} className="shadow-sm" />
                  </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-1">{event.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex-1">
                    {event.city || "No location"} • {new Date(event.start_date || event.date).toLocaleDateString()}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Manage Event &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
