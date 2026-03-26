import api from "../../services/api";
import MotionCard from "../common/MotionCard";

export default function ManagerApprovalCard({ manager }) {
  const approve = async () => {
    await api.post(`/admin/managers/${manager.id}/approve/`);
    alert("Manager Approved");
    window.location.reload();
  };

  const reject = async () => {
    await api.post(`/admin/managers/${manager.id}/reject/`);
    alert("Manager Rejected");
    window.location.reload();
  };

  return (
    <MotionCard className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{manager.name}</p>
        <p className="text-sm text-gray-500">{manager.email}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={approve}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Approve
        </button>

        <button
          onClick={reject}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>
    </MotionCard>
  );
}
