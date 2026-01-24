import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ManageMyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events/my-events/")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading events...</div>;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No confirmed events found</h2>
        <p className="text-gray-500 mb-6">You haven't created any events yet.</p>
        <Link to="/user/create-event" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg">
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Link to="/user/create-event" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
            + New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link to={`/user/event/${event.id}`} key={event.id} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition">{event.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {event.status}
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{event.city} • {new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
