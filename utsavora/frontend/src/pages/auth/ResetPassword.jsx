import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion as Motion } from 'framer-motion';
import AuthLayout from "../../components/auth/AuthLayout";
import { handleApiError } from "../../utils/handleApiError";

const STEPS = [
  { label: "Email", icon: "mail" },
  { label: "OTP", icon: "pin" },
  { label: "New Password", icon: "lock" },
];

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShake(false);

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setShake(true);
          return;
        }
        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          setShake(true);
          return;
        }

        setLoading(true);
        try {
            await api.post("/auth/reset-password/", { email, otp, password });
            alert("Password reset successful!");
            navigate("/login/user");
        } catch (err) {
            setError(handleApiError(err));
            setShake(true);
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
          <AuthLayout brandingHint="Password reset">
            <div className="max-w-md mx-auto">
              <Motion.div
                className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-[28px] p-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-slate-500 text-[32px]">error_outline</span>
                </div>
                <h2 className="text-xl font-black text-slate-900">Session expired</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">Please restart the password reset process.</p>
                <Link to="/forgot-password"
                  className="inline-block mt-5 bg-slate-900 text-white font-black px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Go to Forgot Password →
                </Link>
              </Motion.div>
            </div>
          </AuthLayout>
        );
    }

    const currentStep = 2; // New Password step

    return (
        <AuthLayout brandingHint="Set new password">
          <div className="max-w-4xl mx-auto">
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
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-5 rounded-full ${
                      i < currentStep ? "bg-slate-900" : "bg-slate-200"
                    }`} />
                  )}
                </div>
              ))}
            </Motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden rounded-[28px] shadow-xl border border-slate-200/60">
              {/* Left: Decorative */}
              <Motion.div
                className="lg:col-span-2 relative hidden lg:flex flex-col items-center justify-center p-10"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
                <div className="absolute inset-0 dot-pattern opacity-[0.06] pointer-events-none" />

                {/* Floating orb (CSS-animated) */}
                <div
                  className="absolute w-32 h-32 bg-indigo-500/10 rounded-full top-10 -right-10 blur-2xl animate-float"
                />

                <div className="relative text-center text-white">
                  <Motion.div
                    className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.3 }}
                  >
                    <span className="material-symbols-outlined text-[36px] text-indigo-300">shield</span>
                  </Motion.div>
                  <h2 className="text-2xl font-black tracking-tight">Almost There</h2>
                  <p className="mt-2 text-white/50 text-sm font-medium max-w-[200px] mx-auto leading-relaxed">
                    Enter the OTP and choose a strong new password.
                  </p>
                </div>
              </Motion.div>

              {/* Right: Form */}
              <Motion.div
                className="lg:col-span-3 bg-white/90 backdrop-blur-xl p-8 sm:p-10"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set new password</h1>
                  <p className="mt-1.5 text-slate-500 text-sm font-medium">
                    Enter the OTP sent to <span className="font-bold text-slate-700">{email}</span>
                  </p>
                </div>

                <Motion.form
                  className="space-y-4"
                  onSubmit={handleSubmit}
                  animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
                  transition={{ duration: 0.2 }}
                  onAnimationComplete={() => setShake(false)}
                >
                  {error && (
                    <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700"
                    >
                      {error}
                    </Motion.div>
                  )}

                  <Motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-sm font-bold text-slate-700">OTP Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      autoComplete="one-time-code"
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-slate-300 font-black text-slate-900 text-center tracking-[0.4em] text-lg"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      autoFocus
                    />
                  </Motion.div>

                  <Motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="text-sm font-bold text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Motion.div>

                  <Motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Motion.div>

                  <Motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50 mt-2"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Motion.button>
                </Motion.form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <Link to="/forgot-password" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    ← Restart reset process
                  </Link>
                </div>
              </Motion.div>
            </div>
          </div>
        </AuthLayout>
    );
};

export default ResetPassword;
