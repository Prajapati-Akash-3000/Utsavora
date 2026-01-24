import { useEffect, useState } from "react";
import api from "../../services/api";

export default function VerifyOtp() {
  const email = localStorage.getItem("otp_email");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp/", { email, otp });
      
      const role = res.data.role; // 'USER' or 'MANAGER'

      if (role === 'USER' || role === 'user') {
          // Redirect to User Login
          window.location.href = "/login/user";
      } else {
          // Redirect to Home with message
          alert("Document verification pending. Please wait for admin approval.");
          window.location.href = "/";
      }
      
      localStorage.removeItem("otp_email");
      localStorage.removeItem("otp_role");
      
    } catch {
      // console.error(err);
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
        await api.post("/auth/resend-otp/", { email });
        setTimeLeft(300);
        setError(""); // clear error on resend
    } catch {
        setError("Failed to resend OTP");
    }
  };

  if (!email) {
      window.location.href = "/register"; 
      return null; 
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={verifyOtp}>
        <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
        <p className="text-sm mb-4">Sent to <strong>{email}</strong></p>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border w-full p-2 my-3 text-center tracking-widest rounded"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          required
        />

        <button 
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="text-sm text-center mt-3 text-gray-600">
          {timeLeft > 0
            ? `Resend OTP in ${timeLeft}s`
            : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-indigo-600 underline font-medium hover:text-indigo-800"
              >
                Resend OTP
              </button>
            )}
        </p>
      </form>
    </div>
  );
}
