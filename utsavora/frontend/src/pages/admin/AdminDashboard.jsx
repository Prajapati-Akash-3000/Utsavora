import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/payments/admin/escrow/summary/")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => console.error("Failed to fetch admin stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard data...</p>;
  if (!stats) return <p className="text-red-500">Error loading data</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Financial Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Volume" 
          value={`₹${stats.total_transaction_volume || 0}`} 
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-700"
        />
        <StatCard 
          title="Escrow Balance" 
          value={`₹${stats.total_escrow || 0}`} 
          color="bg-yellow-50 border-yellow-200"
          textColor="text-yellow-700"
        />
        <StatCard 
          title="Platform Revenue" 
          value={`₹${stats.platform_revenue || 0}`} 
          color="bg-green-50 border-green-200"
          textColor="text-green-700"
        />
        <StatCard 
          title="Pending Payouts" 
          value={stats.pending_payouts || 0} 
          color="bg-purple-50 border-purple-200"
          textColor="text-purple-700"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color, textColor }) {
  return (
    <div className={`p-6 rounded-lg shadow-sm border ${color}`}>
      <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h4>
      <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
    </div>
  );
}
