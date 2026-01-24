import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    city: "",
    is_public: true,
    description: ""
  });
  const [loading, setLoading] = useState(false);

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
        event_date: new Date(formData.event_date).toISOString().split("T")[0]
      };
      await api.post("/events/create/", payload);
      alert("Event created successfully!");
      navigate("/user/my-events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Event Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Event Date</label>
          <input
            type="date"
            name="event_date"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.event_date}
            onChange={handleChange}
          />
        </div>

        <div>
           <label className="block text-gray-700 font-medium mb-1">City</label>
           <input
             type="text"
             name="city"
             required
             className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
             value={formData.city}
             onChange={handleChange}
           />
        </div>

        <div>
            <label className="block text-gray-700 font-medium mb-1">Description (Optional)</label>
            <textarea
                name="description"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.description}
                onChange={handleChange}
            />
        </div>

        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                name="is_public"
                id="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 rounded"
            />
            <label htmlFor="is_public" className="text-gray-700">Make this event public?</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
