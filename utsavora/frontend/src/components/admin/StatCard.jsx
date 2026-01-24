export default function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
