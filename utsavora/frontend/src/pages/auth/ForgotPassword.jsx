import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { handleApiError } from '../../utils/handleApiError';
import { motion as Motion } from 'framer-motion';
import CenterLayout from "../../components/auth/CenterLayout";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sent, setSent] = useState(false);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const maskEmail = (e) => {
      if (!e) return "";
      const [user, domain] = e.split("@");
      if (!domain) return e;
      return user.slice(0, 2) + "****@" + domain;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShake(false);
        try {
            await api.post("/auth/forgot-password/", { email });
            setSent(true);
            // Auto-navigate after 2s
            setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
        } catch (err) {
            setError(handleApiError(err));
            setShake(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CenterLayout brandingHint="Secure account recovery">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-[28px] p-8 sm:p-10">
            {/* Animated Lock Icon */}
            <Motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Motion.span
                  className="material-symbols-outlined text-white text-[36px]"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                >
                  lock_reset
                </Motion.span>
              </div>
            </Motion.div>

            <Motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot your password?</h1>
              <p className="mt-2 text-slate-500 text-sm font-medium">
                No worries. Enter your email and we'll send you a reset code.
              </p>
            </Motion.div>

            {sent ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-indigo-600 text-[28px]">mark_email_read</span>
                </div>
                <p className="text-sm font-bold text-slate-900">OTP Sent ✓</p>
                <p className="text-sm text-slate-500 mt-1">
                  We've sent a verification code to <span className="font-bold text-slate-700">{maskEmail(email)}</span>
                </p>
                <p className="text-xs text-slate-400 mt-3">Redirecting to reset page...</p>
              </Motion.div>
            ) : (
              <Motion.form
                className="space-y-5"
                onSubmit={handleSubmit}
                animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.2 }}
                onAnimationComplete={() => setShake(false)}
              >
                {error && (
                  <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                  >
                    {error}
                  </Motion.div>
                )}

                <Motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-bold text-slate-700">Email address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-4 outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-900"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </Motion.div>

                <Motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="material-symbols-outlined text-[18px]">progress_activity</Motion.span>
                      Sending...
                    </span>
                  ) : "Send Reset Code"}
                </Motion.button>
              </Motion.form>
            )}

            <Motion.div
              className="mt-6 pt-6 border-t border-slate-100 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/login/user" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                ← Back to login
              </Link>
            </Motion.div>
          </div>
        </CenterLayout>
    );
};

export default ForgotPassword;
