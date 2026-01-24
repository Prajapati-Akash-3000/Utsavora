import api from "../../services/api";

export default function ManagerCard({ manager }) {
  const sendRequest = async () => {
    await api.post("/bookings/request/", {
      manager: manager.id,
      package_name: "Basic",
      package_price: manager.price,
    });
    alert("Request sent");
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="font-semibold text-lg">{manager.name}</h3>
      <p className="text-gray-600">₹{manager.price}</p>

      <button
        onClick={sendRequest}
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Send Request
      </button>
    </div>
  );
}
