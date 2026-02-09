import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function HireManager() {
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  useEffect(() => {
    // Use the public packages API created in events app
    api.get("/events/packages/")
      .then(res => setManagers(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load managers");
      });
  }, []);

  const handleHire = async (packageId) => {
    if (!window.confirm("Are you sure you want to request this package?")) return;

    try {
      await api.post("/bookings/create/", {
        event_id: eventId,
        package_id: packageId
      });

      toast.success("Booking request sent! Waiting for manager approval.");
      navigate("/user/bookings");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.detail || "Booking failed";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Manager Package</h2>

      {managers.map(pkg => (
        <div key={pkg.id} className="border p-4 mb-4 rounded bg-white shadow-sm">
          <h3 className="font-semibold text-lg">{pkg.title}</h3>
          <p className="text-gray-600">{pkg.description}</p>
          <p className="font-bold mt-2">₹{pkg.price}</p>
          <p className="text-sm text-gray-500 mb-2">By: {pkg.manager_name || "Manager"}</p>

          <button 
            onClick={() => handleHire(pkg.id)}
            className="bg-green-600 text-white px-4 py-1 mt-2 rounded hover:bg-green-700 transition"
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}
