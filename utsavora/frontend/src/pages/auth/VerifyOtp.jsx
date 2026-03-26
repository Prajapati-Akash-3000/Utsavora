import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../services/api";
import { motion as Motion } from "framer-motion";
import AuthLayout from "../../components/auth/AuthLayout";
import { handleApiError } from "../../utils/handleApiError";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 300;

export default function VerifyOtp() {
  const email = localStorage.getItem("otp_email");
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const focusInput = (index) => {
    if (inputRefs.current[index]) inputRefs.current[index].focus();
  };

  const handleChange = useCallback((index, value) => {
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const newDigits = [...digits];
      pasted.forEach((d, i) => { if (index + i < OTP_LENGTH) newDigits[index + i] = d; });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pasted.length, OTP_LENGTH - 1);
      setTimeout(() => focusInput(nextIndex), 0);
      return;
    }

    const char = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < OTP_LENGTH - 1) {
      setTimeout(() => focusInput(index + 1), 0);
    }
  }, [digits]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      setTimeout(() => focusInput(index - 1), 0);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setShake(false);
    const otp = digits.join("");

    if (otp.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      setShake(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp/", { email, otp });
      const role = res.data.role;
      
      if (role === "USER" || role === "user") {
        toast.success(res.data.message || "Registration successful. Please login.");
        setTimeout(() => {
            localStorage.removeItem("otp_email");
            localStorage.removeItem("otp_role");
            window.location.href = "/login/user";
        }, 1500);
      } else {
        toast.success(res.data.message || "Registration successful. Documents pending verification.", { duration: 4000 });
        setTimeout(() => {
            localStorage.removeItem("otp_email");
            localStorage.removeItem("otp_role");
            window.location.href = "/";
        }, 2000);
      }
    } catch (err) {
      setError(handleApiError(err));
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    try {
      await api.post("/auth/resend-otp/", { email });
      setTimeLeft(TIMER_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
    } catch (err) {
      setError(handleApiError(err));
      setShake(true);
    }
  };

  if (!email) {
    window.location.href = "/register";
    return null;
  }

  const progress = timeLeft / TIMER_SECONDS;
  const circumference = 2 * Math.PI * 22;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <AuthLayout brandingHint="Account verification">
      <div className="max-w-lg mx-auto">
        {/* Dark hero card */}
        <Motion.div
          className="relative rounded-[28px] overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div className="absolute inset-0 dot-pattern opacity-[0.06] pointer-events-none" />

          {/* Floating orbs (CSS-animated) */}
          <div
            className="absolute w-40 h-40 bg-indigo-500/10 rounded-full -top-10 -right-10 blur-2xl animate-float"
          />
          <div
            className="absolute w-32 h-32 bg-violet-500/10 rounded-full -bottom-10 -left-10 blur-2xl animate-float"
            style={{ animationDelay: '1s' }}
          />

          <div className="relative p-8 sm:p-10">
            {/* Header */}
            <Motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-bold tracking-wide uppercase mb-4">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verify your account
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Enter verification code</h1>
              <p className="mt-2 text-white/50 text-sm font-medium">
                We sent a 6-digit code to <span className="text-white/80 font-bold">{email}</span>
              </p>
            </Motion.div>

            {/* OTP Digit Boxes */}
            <Motion.form
              onSubmit={verifyOtp}
              animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.2 }}
              onAnimationComplete={() => setShake(false)}
              className="space-y-6"
            >
              {error && (
                <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-xl bg-red-500/15 border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-300 text-center"
                >
                  {error}
                </Motion.div>
              )}

              <div className="flex justify-center gap-3">
                {digits.map((d, i) => (
                  <Motion.input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={OTP_LENGTH}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-xl outline-none transition-all border-2 ${
                      d ? "bg-white/15 border-indigo-400 text-white" : "bg-white/[0.06] border-white/15 text-white/80"
                    } focus:border-indigo-400 focus:bg-white/15 focus:ring-4 focus:ring-indigo-400/20 placeholder:text-white/20`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  />
                ))}
              </div>

              {/* Countdown Ring + Verify Button */}
              <div className="flex flex-col items-center gap-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-100 hover:shadow-lg transition-all outline-none focus:ring-4 focus:ring-white/25 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Account"}
                </button>

                {/* Countdown ring */}
                <div className="flex items-center gap-3">
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <Motion.circle
                      cx="25" cy="25" r="22" fill="none" stroke="rgba(129,140,248,0.8)" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress)}
                      transform="rotate(-90 25 25)"
                      initial={false}
                    />
                    <text x="25" y="25" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="11" fontWeight="800">
                      {mins}:{secs.toString().padStart(2, "0")}
                    </text>
                  </svg>
                  <div>
                    {timeLeft > 0 ? (
                      <p className="text-xs font-bold text-white/40">Resend available soon</p>
                    ) : (
                      <button type="button" onClick={resendOtp}
                        className="text-indigo-300 font-bold hover:text-indigo-200 transition-colors text-sm"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Motion.form>
          </div>
        </Motion.div>
      </div>
    </AuthLayout>
  );
}
