import { useState } from "react";
import api from "../../services/api";
import Button from "../ui/Button";

export default function EventRegisterCard({ event, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const isFree = event.pricing_type === 'FREE';

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
        alert("Please fill in all fields");
        return;
    }

    setLoading(true);
    try {
      if (isFree) {
        // Free registration (no payment)
        await api.post(`/events/public/${event.id}/register/`, form);
      } else {
        // Paid registration - this should ideally redirect to the payment flow
        // For now, let's assume it creates a pending registration or initiates payment
        // You might need to adjust this endpoint based on your backend implementation for Public Event Payment
        const res = await api.post(`/events/public/${event.id}/register/`, form);
        if(res.data.payment_link) {
            window.location.href = res.data.payment_link;
            return;
        }
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Register for Event
      </h2>

      <div className="space-y-4 mb-6">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
          </div>
      </div>

      {!isFree && (
        <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
            <span className="text-gray-700 font-medium">Registration Fee</span>
            <span className="text-2xl font-bold text-purple-700">₹{event.registration_fee}</span>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        loading={loading}
        className="w-full py-3 text-lg"
        variant="primary"
      >
        {isFree ? "Register for Free" : "Pay & Register"}
      </Button>
      
      <p className="text-center text-xs text-gray-500 mt-4">
          By registering, you agree to our Terms & Conditions.
      </p>
    </div>
  );
}
