import { useEffect, useState } from "react";
import api from "../../services/api";
import ManagerCard from "../../components/booking/ManagerCard";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function HireManager() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... useEffect stays same ...

  if (loading) return <Loader text="Loading managers..." />;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Managers</h1>
        {managers.length === 0 ? (
            <EmptyState message="No managers available in your area." />
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
            {managers.map((m) => (
                <ManagerCard key={m.id} manager={m} />
            ))}
            </div>
        )}
    </div>
  );
}
