import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    api.get("/payments/admin/escrow/payments/")
      .then(res => setPayments(res.data))
      .catch(err => console.error("Failed to fetch transactions", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id, action) => {
    const isRelease = action === 'release';
    const confirmMessage = isRelease 
      ? "Are you sure you want to RELEASE this payment to the manager?" 
      : "Are you sure you want to REFUND this user? This will cancel the booking.";

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.post(`/payments/admin/escrow/${action}/${id}/`);
      alert(`Payment ${isRelease ? 'Released' : 'Refunded'} successfully`);
      fetchPayments();
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Transaction History</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Event</th>
              <th className="p-4 border-b">User</th>
              <th className="p-4 border-b">Manager</th>
              <th className="p-4 border-b">Amount</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map(p => (
              <tr key={p.payment_id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{p.event}</td>
                <td className="p-4 text-gray-600">{p.user}</td>
                <td className="p-4 text-gray-600">{p.manager}</td>
                <td className="p-4 font-mono font-medium">₹{p.amount}</td>
                <td className="p-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-4 space-x-2">
                  {p.status === "ESCROW" && (
                    <>
                      <button 
                        onClick={() => handleAction(p.payment_id, 'release')}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                      >
                        Release
                      </button>
                      <button 
                        onClick={() => handleAction(p.payment_id, 'refund')}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                      >
                        Refund
                      </button>
                    </>
                  )}
                   {p.status !== "ESCROW" && <span className="text-gray-400 text-sm">-</span>}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    ESCROW: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    RELEASED: "bg-green-100 text-green-800",
    REFUNDED: "bg-red-100 text-red-800",
    PENDING: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}
