import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { getMyEvents } from "../../services/eventService";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { PageLoader } from "../../components/ui/Loading";
import PageWrapper from "../../components/motion/PageWrapper";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function ManageMyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents()
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.start_date || b.date) - new Date(a.start_date || a.date));
        setEvents(sorted);
      })
      .catch(err => console.error("Failed to fetch events", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(event => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.start_date || event.date);
    eventDate.setHours(0, 0, 0, 0);
    if (filter === "upcoming") return eventDate >= today && event.status !== "COMPLETED" && event.status !== "CANCELLED";
    if (filter === "completed") return eventDate < today || event.status === "COMPLETED" || event.status === "CANCELLED";
    return true;
  });

  if (loading) return <PageLoader />;

  const stats = {
    total: events.length,
    upcoming: events.filter(e => { const d = new Date(e.start_date || e.date); d.setHours(0,0,0,0); return d >= new Date().setHours(0,0,0,0) && e.status !== "COMPLETED" && e.status !== "CANCELLED"; }).length,
    completed: events.filter(e => e.status === "COMPLETED" || new Date(e.start_date || e.date) < new Date().setHours(0,0,0,0)).length,
  };

  if (events.length === 0) {
    return (
      <PageWrapper>
        <EmptyState
          title="No events yet"
          message="Create your first event to get started."
          actionLabel="Create Event"
          onAction={() => navigate("/user/create-event")}
          icon="calendar"
          className="mt-10 mx-auto max-w-lg"
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <Motion.div
        className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Events</h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm">Manage and track all your events in one place.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Stats pills */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-lg font-black">{stats.total}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Events</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-lg font-black">{stats.upcoming}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Active</span>
            </div>
          </div>

          {/* Filter + Create */}
          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-slate-100/80 backdrop-blur-md rounded-xl border border-slate-200/60">
              {['all', 'upcoming', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 capitalize transition-all duration-300 rounded-lg text-[13px] font-bold ${
                    filter === f
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Link to="/user/create-event">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Event
              </button>
            </Link>
          </div>
        </div>
      </Motion.div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          title={`No ${filter !== 'all' ? filter : ''} events found`.replace(/\s+/g, ' ')}
          message={filter === 'all' ? "You haven't created any events yet." : `You don't have any ${filter} events.`}
          actionLabel={filter === 'all' ? "Create Event" : "View All"}
          onAction={() => filter === 'all' ? navigate("/user/create-event") : setFilter("all")}
          icon="calendar"
          className="mt-10 mx-auto max-w-lg"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, i) => {
            const isCompleted = event.status === "COMPLETED" || new Date(event.start_date || event.date) < new Date().setHours(0,0,0,0);

            return (
              <Motion.div
                key={event.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link to={`/user/event/${event.id}`} className="block group h-full">
                  <div className="bg-white/80 backdrop-blur-xl rounded-[24px] border border-slate-200/60 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col shadow-sm">
                    {/* Card gradient header */}
                    <div className={`h-44 relative overflow-hidden transition-all duration-700 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-slate-400 to-slate-500 grayscale-[50%]'
                        : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 group-hover:scale-[1.03]'
                    }`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                      {!isCompleted && (
                        <>
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:translate-x-4 transition-transform duration-700" />
                          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-400/15 rounded-full blur-xl group-hover:-translate-x-4 transition-transform duration-700" />
                        </>
                      )}
                      <div className="absolute bottom-4 left-4 z-10">
                        <Badge status={event.status} className="shadow-lg backdrop-blur-xl bg-white/80 border border-white/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900" />
                      </div>
                      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 z-10">
                        {event.city || "Online"}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 leading-tight mb-3 tracking-tight">
                        {event.title}
                      </h3>

                      <div className="flex items-center text-slate-400 text-sm mb-6">
                        <span className="material-symbols-outlined text-[16px] mr-1.5 text-slate-300">calendar_month</span>
                        <span className="font-bold text-xs">
                          {new Date(event.start_date || event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300">
                          Manage Event
                        </span>
                        <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center transition-all duration-300 group-hover:rotate-[-45deg]">
                          <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-indigo-600 transition-colors">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Motion.div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
