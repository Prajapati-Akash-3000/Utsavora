import api from "../../services/api";
import { useState } from "react";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import { motion as Motion } from "framer-motion";

export default function PayFinalButton({ bookingId }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFinalPay = async () => {
    try {
      setLoading(true);
      await api.post(`/payments/escrow/final/${bookingId}/`);
      setSuccess(true);
      toast.success("Final payment successful!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setLoading(false);
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
      <p className="font-semibold text-green-800 mb-2">
        Event Completed – Final Settlement Pending
      </p>

      <Button
        onClick={handleFinalPay}
        loading={loading}
        disabled={success}
        className={`px-6 py-3 shadow ${success ? 'bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
      >
        {success ? (
            <Motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2"
            >
              ✅ Settlement Complete
            </Motion.span>
        ) : "Pay Remaining 50%"}
      </Button>
    </div>
  );
}
