import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { getUserBookings } from "../../services/bookingService";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";
import { PageLoader } from "../../components/ui/Loading";
import { handleApiError } from "../../utils/handleApiError";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => {
        toast.error(handleApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const startPayment = async (bookingId) => {
    try {
      const res = await createPaymentOrder(bookingId);
      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "Utsavora",
        description: "Event Booking Payment",
        order_id: res.data.order_id,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            toast.success("Payment successful!");
            const refreshRes = await getUserBookings();
            setBookings(refreshRes.data);
          } catch (verifyErr) {
            console.error(verifyErr);
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#4f46e5" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      ACCEPTED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/60", icon: "check_circle", label: "Accepted" },
      PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/60", icon: "schedule", label: "Pending" },
      REJECTED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200/60", icon: "cancel", label: "Rejected" },
      CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/60", icon: "verified", label: "Confirmed" },
    };
    return configs[status] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200/60", icon: "help", label: status };
  };

  if (loading) return <PageLoader />;

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === "ACCEPTED" || b.status === "CONFIRMED").length,
    pending: bookings.filter(b => b.status === "PENDING").length,
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <Motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <button
              onClick={() => navigate('/user/my-events')}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-5"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">Back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-500 mt-1.5 font-medium text-sm">Track bookings and manage payments.</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2.5">
              <span className="text-xl font-black">{stats.total}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-5 py-2.5 rounded-xl flex items-center gap-2.5">
              <span className="text-xl font-black">{stats.active}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Active</span>
            </div>
            <div className="bg-amber-50 border border-amber-200/60 text-amber-700 px-5 py-2.5 rounded-xl flex items-center gap-2.5">
              <span className="text-xl font-black">{stats.pending}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Pending</span>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* Bookings List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
        {bookings.length === 0 ? (
          <Motion.div
            className="bg-white/80 backdrop-blur-xl rounded-[28px] p-16 border border-slate-200/60 text-center max-w-lg mx-auto mt-8 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-[20px] bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[36px]">receipt_long</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-400 font-medium mb-8 text-sm">You haven't booked any manager packages.</p>
            <button
              onClick={() => navigate('/user/my-events')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse Events
            </button>
          </Motion.div>
        ) : (
          <>
            {/* Table header (desktop) */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-7 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="col-span-5">Event</div>
              <div className="col-span-3">Manager</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {bookings.map((booking, i) => {
              const config = getStatusConfig(booking.status);
              return (
                <Motion.div
                  key={booking.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group bg-white/80 backdrop-blur-xl rounded-[20px] border border-slate-200/60 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden shadow-sm"
                >
                  <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center p-6 sm:p-7">
                    {/* Event */}
                    <div className="md:col-span-5 mb-4 md:mb-0">
                      <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {booking.event_title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-slate-300">calendar_month</span>
                        {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Manager */}
                    <div className="md:col-span-3 mb-4 md:mb-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-[11px] font-black flex-shrink-0">
                          {(booking.manager_name || booking.manager_company || booking.manager_email || "M").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600 font-semibold truncate">
                          {booking.manager_name || booking.manager_company || booking.manager_email}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 mb-4 md:mb-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                        <span className="material-symbols-outlined text-[13px]">{config.icon}</span>
                        {config.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex justify-start md:justify-end">
                      {booking.status === "ACCEPTED" && booking.payment_status !== "FULLY_PAID" && (
                        <button
                          onClick={() => startPayment(booking.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                      {booking.status === "CONFIRMED" && booking.payment_status === "FULLY_PAID" && (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-xl">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
                        </div>
                      )}
                      {booking.status === "PENDING" && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting response</span>
                      )}
                      {booking.status === "REJECTED" && (
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Declined</span>
                      )}
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
