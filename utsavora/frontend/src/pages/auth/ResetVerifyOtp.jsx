import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ResetVerifyOtp() {
  const email = localStorage.getItem("reset_email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/password-reset/verify/", { email, otp });
      // Store OTP to verify it again in the final step (secure flow)
      localStorage.setItem("reset_otp", otp); 
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Verification Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={verify} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl mb-4 font-semibold">Verify OTP</h2>
        
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        <input
          className="border p-2 w-full mb-4 text-center tracking-widest text-xl"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          required
        />

        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition">
          Verify OTP
        </button>
      </form>
    </div>
  );
}
