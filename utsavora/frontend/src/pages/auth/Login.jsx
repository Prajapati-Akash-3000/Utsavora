import { useState } from "react";
import api from "../../services/api";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setShake(false);
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", { email, password });
      const authData = {
        access: res.data.access,
        refresh: res.data.refresh,
        role: res.data.role,
        name: res.data.full_name || res.data.user?.full_name || "",
        full_name: res.data.full_name || res.data.user?.full_name || "",
        email: res.data.email || res.data.user?.email || "",
        id: res.data.user?.id || null,
      };
      localStorage.setItem("auth", JSON.stringify(authData));
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      window.location.href = "/";
    } catch {
      setError("Invalid credentials or account not verified");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      sideTitle="Your Events Await."
      sideSubtitle="Pick up where you left off — your events, bookings, and invitations are ready."
      footer={
        <div className="flex items-center justify-between text-sm font-semibold">
          <Link to="/register" className="text-slate-600 hover:text-slate-900 transition-colors">
            New here? <span className="text-indigo-600">Create an account</span>
          </Link>
          <Link to="/forgot-password" className="text-slate-600 hover:text-slate-900 transition-colors">
            Forgot password?
          </Link>
        </div>
      }
    >
      <Motion.form
        onSubmit={submit}
        animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.15 }}
        onAnimationComplete={() => setShake(false)}
        className="space-y-4"
      >
        {error && (
          <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </Motion.div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Your password"
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            to="/login/user"
            className="w-full text-center bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-50 transition"
          >
            User Login
          </Link>
          <Link
            to="/login/manager"
            className="w-full text-center bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-50 transition"
          >
            Manager Login
          </Link>
        </div>
      </Motion.form>
    </AuthShell>
  );
}
