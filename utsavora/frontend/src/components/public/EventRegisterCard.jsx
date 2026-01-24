import { useState } from "react";
import api from "../../services/api";

export default function EventRegisterCard({ event, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const isFree = event.registration_fee === 0;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isFree) {
        // Free registration (no payment)
        await api.post(`/events/${event.id}/register-free/`, form);
      } else {
        // Paid registration
        await api.post(`/payments/public/${event.id}/`);
      }
      onSuccess();
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        Register for this Event
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        className="w-full border p-2 rounded mb-3"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full border p-2 rounded mb-4"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {!isFree && (
        <p className="text-sm text-gray-600 mb-4">
          Registration Fee: <strong>₹{event.registration_fee}</strong>
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 rounded text-white ${
          isFree
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading
          ? "Processing..."
          : isFree
          ? "Register for Free"
          : "Pay & Register"}
      </button>
    </div>
  );
}
