import React from "react";
import MotionCard from "../common/MotionCard";

const StatCard = React.memo(function StatCard({ label, value }) {
  return (
    <MotionCard className="bg-white shadow-sm rounded-lg p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </MotionCard>
  );
});

export default StatCard;
