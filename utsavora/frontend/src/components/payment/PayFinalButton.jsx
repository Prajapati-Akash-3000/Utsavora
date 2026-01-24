import api from "../../services/api";

export default function PayFinalButton({ bookingId }) {
  const handleFinalPay = async () => {
    try {
      await api.post(`/payments/escrow/final/${bookingId}/`);
      alert("Final payment successful");
      window.location.reload();
    } catch (err) {
      alert("Final payment failed");
    }
  };

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
      <p className="font-semibold text-green-800 mb-2">
        Event Completed – Final Settlement Pending
      </p>

      <button
        onClick={handleFinalPay}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow transition"
      >
        Pay Remaining 50%
      </button>
    </div>
  );
}
