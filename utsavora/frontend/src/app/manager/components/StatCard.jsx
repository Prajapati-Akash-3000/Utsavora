import React from "react";

const StatCard = React.memo(function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-2xl font-semibold mt-2 ${color}`}>
        {value}
      </h3>
    </div>
  );
});

export default StatCard;
