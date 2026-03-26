import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { handleApiError } from "../../utils/handleApiError";
import { motion as Motion } from "framer-motion";
import CenterLayout from "../../components/auth/CenterLayout";

const OTP_LENGTH = 6;

const STEPS = [
  { label: "Email", icon: "mail" },
  { label: "OTP", icon: "pin" },
  { label: "New Password", icon: "lock" },
];

export default function ResetVerifyOtp() {
  const email = localStorage.getItem("reset_email");
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const focusInput = (index) => {
    if (inputRefs.current[index]) inputRefs.current[index].focus();
  };

  const handleChange = useCallback((index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const newDigits = [...digits];
      pasted.forEach((d, i) => { if (index + i < OTP_LENGTH) newDigits[index + i] = d; });
      setDigits(newDigits);
      setTimeout(() => focusInput(Math.min(index + pasted.length, OTP_LENGTH - 1)), 0);
      return;
    }
    const char = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (char && index < OTP_LENGTH - 1) setTimeout(() => focusInput(index + 1), 0);
  }, [digits]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      setTimeout(() => focusInput(index - 1), 0);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError(""); setShake(false);
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) { setError("Please enter all 6 digits."); setShake(true); return; }
    setLoading(true);
    try {
      await api.post("/auth/password-reset/verify/", { email, otp });
      localStorage.setItem("reset_otp", otp);
      navigate("/reset-password");
    } catch (err) {
      setError(handleApiError(err));
      setShake(true);
    } finally { setLoading(false); }
  };

  if (!email) { window.location.href = "/forgot-password"; return null; }

  const currentStep = 1; // OTP step

  return (
    <CenterLayout brandingHint="Password reset" maxWidth="max-w-lg">
      {/* Step Indicator */}
      <Motion.div
        className="flex items-center justify-center gap-0 mb-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                i < currentStep
                  ? "bg-slate-900 border-slate-900 text-white"
                  : i === currentStep
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white border-slate-200 text-slate-400"
              }`}>
                {i < currentStep ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                )}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 ${
                i === currentStep ? "text-indigo-600" : i < currentStep ? "text-slate-700" : "text-slate-400"
              }`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-16 h-0.5 mx-2 mb-5 rounded-full ${
                i < currentStep ? "bg-slate-900" : "bg-slate-200"
              }`} />
            )}
          </div>
        ))}
      </Motion.div>

      {/* Card */}
      <Motion.div
        className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-[28px] p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify reset code</h1>
          <p className="mt-2 text-slate-500 text-sm font-medium">
            Enter the 6-digit code sent to <span className="font-bold text-slate-700">{email}</span>
          </p>
        </div>

        <Motion.form
          onSubmit={verify}
          animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => setShake(false)}
          className="space-y-6"
        >
          {error && (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 text-center"
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
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all ${
                  d ? "border-indigo-500 bg-indigo-50 text-slate-900" : "border-slate-200 bg-white text-slate-900"
                } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </Motion.form>
      </Motion.div>
    </CenterLayout>
  );
}
