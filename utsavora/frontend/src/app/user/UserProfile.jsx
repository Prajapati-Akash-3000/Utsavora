import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import api from "../../services/api";
import { PageLoader } from "../../components/ui/Loading";
import PageWrapper from "../../components/motion/PageWrapper";
import Button from "../../components/ui/Button";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

function StatCard({ label, value, icon, accent = "slate" }) {
  const accents = {
    slate: "bg-slate-50 border-slate-200/60 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200/60 text-indigo-700",
    red: "bg-red-50 border-red-200/60 text-red-700",
    amber: "bg-amber-50 border-amber-200/60 text-amber-700",
    blue: "bg-blue-50 border-blue-200/60 text-blue-700",
  };
  return (
    <Motion.div variants={fadeUp} className={`rounded-2xl p-5 border ${accents[accent]} transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="material-symbols-outlined text-[20px] opacity-50">{icon}</span>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{label}</div>
    </Motion.div>
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/accounts/profile/")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!profile) {
    return (
      <PageWrapper className="max-w-4xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-10 border border-slate-200/60 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[28px] text-slate-400">error_outline</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Profile unavailable</h1>
          <p className="text-slate-500 mt-2 font-medium">Please try again later.</p>
        </div>
      </PageWrapper>
    );
  }

  const user = profile.user || {};
  const stats = profile.stats || {};
  const events = stats.events || {};
  const categories = stats.categories || [];
  const bookings = stats.bookings || {};

  const avatarInitials = (user.full_name || user.email || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Profile Header */}
      <Motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <span className="text-white font-black text-xl">{avatarInitials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px]">check</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {user.full_name || "Your Profile"}
            </h1>
            <p className="text-slate-500 mt-1 font-semibold text-sm">{user.email}</p>
            {user.mobile && <p className="text-slate-400 mt-0.5 font-semibold text-sm">{user.mobile}</p>}
          </div>
        </div>

        <Motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => navigate("/user/profile/edit")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all hover:shadow-sm hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </Motion.div>
      </Motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Analytics */}
          <Motion.div
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-7 border border-slate-200/60 shadow-sm"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Event Analytics</h2>
              <span className="material-symbols-outlined text-[20px] text-slate-300">analytics</span>
            </div>
            <Motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3" variants={stagger}>
              <StatCard label="Total" value={events.total ?? 0} icon="event" accent="slate" />
              <StatCard label="Ongoing" value={events.ongoing ?? 0} icon="play_circle" accent="emerald" />
              <StatCard label="Completed" value={events.completed ?? 0} icon="check_circle" accent="indigo" />
            </Motion.div>

            {/* Category Breakdown */}
            <Motion.div variants={fadeUp} className="mt-8">
              <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Category Breakdown</h3>
              {categories.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-6 text-center">
                  <p className="text-slate-400 text-sm font-medium">No events yet. Create your first event to see stats.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Total</th>
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ongoing</th>
                        <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {categories.map((c) => (
                        <tr key={c.category_id ?? c.slug ?? c.name} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold">{c.name}</td>
                          <td className="py-3 px-4 font-semibold">{c.total}</td>
                          <td className="py-3 px-4 font-semibold text-emerald-600">{c.ongoing}</td>
                          <td className="py-3 px-4 font-semibold text-indigo-600">{c.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Motion.div>
          </Motion.div>

          {/* Bookings Snapshot */}
          <Motion.div
            className="bg-white/80 backdrop-blur-xl rounded-[24px] p-7 border border-slate-200/60 shadow-sm"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Bookings Snapshot</h2>
              <span className="material-symbols-outlined text-[20px] text-slate-300">receipt_long</span>
            </div>
            <Motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={stagger}>
              <StatCard label="Total" value={bookings.total ?? 0} icon="receipt_long" accent="slate" />
              <StatCard label="Pending" value={bookings.by_status?.PENDING ?? 0} icon="schedule" accent="amber" />
              <StatCard label="Confirmed" value={bookings.by_status?.CONFIRMED ?? 0} icon="verified" accent="blue" />
              <StatCard label="Paid" value={bookings.by_payment_status?.FULLY_PAID ?? 0} icon="payments" accent="emerald" />
            </Motion.div>
          </Motion.div>
        </div>

        {/* Sidebar */}
        <Motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Account Details */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-7 border border-slate-200/60 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-5">Account Details</h2>
            <div className="space-y-4 text-sm">
              {[
                { label: "Full Name", value: user.full_name, icon: "person" },
                { label: "Mobile", value: user.mobile, icon: "phone" },
                { label: "Role", value: user.role || "USER", icon: "badge" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
                  <span className="flex items-center gap-2 text-slate-500 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-slate-900 font-bold">{item.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-7 border border-slate-200/60 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-3">Quick Actions</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">
              Create events to grow your analytics and booking stats.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate("/user/create-event")}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Event
              </button>
              <button
                onClick={() => navigate("/user/bookings")}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200/80 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 hover:shadow-sm transition-all text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                View Bookings
              </button>
            </div>
          </div>
        </Motion.div>
      </div>
    </PageWrapper>
  );
}
