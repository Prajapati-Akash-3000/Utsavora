import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function ManagerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/bookings/manager/requests/");
      // SAFETY CHECK: Ensure response is an array
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
      setRequests([]); // Fallback to empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptBooking = async (id) => {
    try {
      await api.post(`/bookings/accept/${id}/`);
      toast.success("Booking accepted");
      fetchRequests();
    } catch {
      toast.error("Accept failed");
    }
  };

  const rejectBooking = async (id) => {
    if (!window.confirm("Are you sure you want to reject this booking?")) return;
    try {
      await api.post(`/bookings/reject/${id}/`);
      toast.success("Booking rejected");
      fetchRequests();
    } catch {
      toast.error("Reject failed");
    }
  };



  // New function to check conflicts for a single booking
  const checkConflict = async (bookingId) => {
      try {
          const res = await api.get(`/bookings/conflicts/${bookingId}/`);
          return res.data;
      } catch (err) {
          console.error("Conflict check failed", err);
          return null;
      }
  };

  // Enhance requests with conflict data
  const [conflicts, setConflicts] = useState({}); // { bookingId: { has_conflict: boolean, dates: [] } }

  useEffect(() => {
      requests.forEach(async (req) => {
          if (req.status === 'PENDING') {
              const conflictData = await checkConflict(req.id);
              if (conflictData) {
                  setConflicts(prev => ({ ...prev, [req.id]: conflictData }));
              }
          }
      });
  }, [requests]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Booking Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm ${conflicts[req.id]?.has_conflict ? 'border-red-500 bg-red-50' : ''}`}
            >
              <div>
                <h3 className="font-semibold">{req.event}</h3>
                <p className="text-sm text-gray-500">
                  User: {req.user_name}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {req.date}
                </p>
                <p className="text-sm font-bold text-green-600">
                  ₹{req.price}
                </p>
                
                {/* Conflict Warning */}
                {conflicts[req.id]?.has_conflict && (
                    <div className="mt-2 text-red-600 text-sm font-bold flex items-center gap-1">
                        ⚠ This booking conflicts with already booked dates!
                    </div>
                )}

                <div className="mt-1">
                   {req.status === "PENDING" && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>}
                   {req.status === "ACCEPTED" && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Accepted</span>}
                   {req.status === "REJECTED" && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Rejected</span>}
                   {req.status === "CANCELLED" && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Cancelled</span>}
                </div>
              </div>

              <div className="flex gap-2">
                {req.status === "PENDING" ? (
                    <>
                        <button
                        onClick={() => acceptBooking(req.id)}
                        disabled={conflicts[req.id]?.has_conflict}
                        className={`px-4 py-2 text-white rounded transition ${conflicts[req.id]?.has_conflict ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                        Accept
                        </button>
                        <button
                        onClick={() => rejectBooking(req.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                        Reject
                        </button>
                    </>
                ) : (
                    <span className="text-gray-500 italic text-sm self-center">
                        {req.status === "ACCEPTED" ? "Accepted" : req.status === "REJECTED" ? "Rejected" : "Processed"}
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
