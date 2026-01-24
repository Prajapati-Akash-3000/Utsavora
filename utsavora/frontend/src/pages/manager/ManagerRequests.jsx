import { useState, useEffect } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Message from "../../components/common/Message";

export default function ManagerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error', text: '' }

  const fetchRequests = () => {
      api.get("/bookings/manager/requests/")
      .then(res => {
          setRequests(res.data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
        await api.post(`/bookings/accept/${id}/`);
        setMsg({ type: "success", text: "Booking accepted successfully!" });
        // Refresh list
        fetchRequests();
        // clear message after 3s
        setTimeout(() => setMsg(null), 3000);
    } catch (e) {
        setMsg({ type: "error", text: "Failed to accept booking." });
    }
  };

  if (loading) return <Loader text="Loading requests..." />;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      
      {msg && <Message type={msg.type} text={msg.text} />}

      {requests.length === 0 ? (
        <EmptyState message="No pending requests." />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{req.event}</p>
                <p>₹{req.price}</p>
              </div>

              <button
                onClick={() => acceptRequest(req.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
