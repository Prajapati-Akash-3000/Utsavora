import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminEscrow() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    api.get("/payments/admin/escrow/payments/")
      .then(res => {
        setPayments(res.data);
      })
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRelease = async (id) => {
    if (!window.confirm("Release this payment to manager?")) return;
    try {
        await api.post(`/payments/admin/escrow/release/${id}/`);
        toast.success("Payment released to manager");
        fetchPayments();
    } catch {
        toast.error("Failed to release payment");
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm("Refund this payment to user? This will cancel the booking.")) return;
    try {
        await api.post(`/payments/admin/escrow/refund/${id}/`);
        toast.success("Refund processed");
        fetchPayments();
    } catch {
        toast.error("Failed to process refund");
    }
  };

  if (loading) return <div className="p-8">Loading escrow data...</div>;

  return (
    <div className="p-6">
       <h1 className="text-2xl font-bold mb-6 text-gray-800">Escrow Management</h1>
       
       <div className="bg-white shadow rounded-lg overflow-hidden">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User / Manager</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {payments.map((p) => (
               <tr key={p.id}>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.event}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                        <span>U: {p.user}</span>
                        <span>M: {p.manager}</span>
                    </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    ₹{p.amount}
                    <span className="block text-xs text-gray-400 font-normal">Mgr: ₹{p.manager_amount}</span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${p.status === 'ESCROW' ? 'bg-yellow-100 text-yellow-800' : 
                          p.status === 'RELEASED' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {p.status}
                    </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {p.status === 'ESCROW' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRelease(p.id)}
                                className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded"
                            >
                                Release
                            </button>
                            <button
                                onClick={() => handleRefund(p.id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                            >
                                Refund
                            </button>
                        </div>
                    )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         {payments.length === 0 && (
             <div className="p-8 text-center text-gray-500">No transactions found</div>
         )}
       </div>
    </div>
  );
}
