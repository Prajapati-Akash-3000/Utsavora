import { useEffect, useState } from "react";
import api from "../../services/api";
import PayAdvanceButton from "../../components/payment/PayAdvanceButton";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/list/")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Failed to fetch bookings", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your bookings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Bookings</h1>
      
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
            
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">{booking.event_title}</h3>
              <p className="text-sm text-gray-500">Manager: {booking.manager_email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Requested on: {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={booking.status} />
              
              {booking.status === "PAYMENT_PENDING" && (
                <div className="mt-2">
                    <p className="text-xs text-red-500 mb-1 text-right">
                        Expires: {new Date(booking.payment_deadline).toLocaleString()}
                    </p>
                    <PayAdvanceButton bookingId={booking.id} />
                </div>
              )}
            </div>

          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center p-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't made any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    REQUESTED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-purple-100 text-purple-800",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-teal-100 text-teal-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
