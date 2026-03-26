import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { handleApiError } from '../../utils/handleApiError';
import { motion as Motion } from 'framer-motion';
import AuthShell from "../../components/auth/AuthShell";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShake(false);
        setLoading(true);
        try {
            const res = await api.post("/auth/login/", { email, password });
            if (res.data.role !== "USER") {
                setError("This portal is for users only. Please use the Manager Login.");
                setShake(true);
                setLoading(false);
                return;
            }
            const authData = {
                access: res.data.access,
                refresh: res.data.refresh,
                role: res.data.role,
                name: res.data.full_name || res.data.user?.full_name || res.data.name || "",
                full_name: res.data.full_name || res.data.user?.full_name || "",
                email: res.data.email || res.data.user?.email || "",
                username: res.data.email || res.data.user?.email || "",
                id: res.data.user?.id || null,
            };
            localStorage.setItem("auth", JSON.stringify(authData));
            localStorage.setItem("access", authData.access);
            localStorage.setItem("refresh", authData.refresh);
            window.location.href = "/";
        } catch (err) {
             setError(handleApiError(err));
             setShake(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
          title="User login"
          subtitle="Access your events, bookings, and invitations."
          sideTitle="Celebrate Together."
          sideSubtitle="Create, share, and manage your events with a beautiful, intuitive platform."
          sideFeatures={[
            { icon: "celebration", label: "Plan memorable events" },
            { icon: "mail", label: "Send digital invitations" },
            { icon: "photo_library", label: "Collect event memories" },
            { icon: "group", label: "Manage guest lists" },
          ]}
          footer={
            <div className="flex items-center justify-between text-sm font-semibold">
              <Link to="/register" className="text-slate-600 hover:text-slate-900 transition-colors">
                Create account <span className="text-indigo-600">→</span>
              </Link>
              <Link to="/login/manager" className="text-slate-600 hover:text-slate-900 transition-colors">
                Manager login
              </Link>
            </div>
          }
        >
          <Motion.form
            className="space-y-4"
            onSubmit={handleSubmit}
            animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.15 }}
            onAnimationComplete={() => setShake(false)}
          >
            {error && (
              <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </Motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input type="email" required
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
                placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input type="password" required
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
                placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </Motion.form>
        </AuthShell>
    );
};

export default UserLogin;
