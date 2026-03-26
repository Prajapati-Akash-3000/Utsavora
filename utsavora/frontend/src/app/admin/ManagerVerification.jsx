import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Message from "../../components/common/Message";

export default function ManagerVerification() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchManagers = () => {
    api.get("/accounts/admin/pending-managers/")
      .then((res) => {
          setManagers(res.data);
          setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
          await api.post(`/accounts/admin/approve-manager/${id}/`);
      } else {
          await api.post(`/accounts/admin/reject-manager/${id}/`);
      }
      setMsg({ type: "success", text: `Manager ${action}d successfully.` });
      // Remove from list immediately
      setManagers(managers.filter((m) => m.id !== id));
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setMsg({ type: "error", text: `Failed to ${action} manager.` });
    }
  };

  if (loading) return <Loader text="Loading pending managers..." />;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Manager Approvals</h1>
      
      {msg && <Message type={msg.type} text={msg.text} />}

      {managers.length === 0 ? (
        <EmptyState message="No pending approvals." />
      ) : (
        <div className="space-y-4">
          {managers.map((m) => (
            <div key={m.id} className="bg-white p-4 shadow rounded flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="font-semibold">{m.company_name}</p>
                <p className="text-sm text-gray-500">{m.city}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleAction(m.id, "approve")}
                  className="w-full md:w-auto px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(m.id, "reject")}
                  className="w-full md:w-auto px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
