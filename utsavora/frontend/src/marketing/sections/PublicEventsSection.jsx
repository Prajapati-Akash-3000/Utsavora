import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Compass, CalendarX2 } from "lucide-react";
import EventCard from "./EventCard";
import { getPublicEvents } from "../../services/eventService";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function PublicEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getPublicEvents();
        setEvents(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 shadow-sm">
            <Compass size={14} className="text-primary" />
            Browse Events
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
            Discover Public Events
          </h2>
        </Motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <Motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
            >
              {events.map(event => (
                <Motion.div key={event.id} variants={item}>
                  <EventCard
                    title={event.title}
                    date={event.start_date
                      ? new Date(event.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                      : "Date TBA"
                    }
                    location={[event.venue, event.city].filter(Boolean).join(', ') || "Location TBA"}
                    image={event.template_details?.background_image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop`}
                    tag={event.category || event.template_details?.category}
                    pricingType={event.pricing_type}
                    price={event.registration_fee}
                    link={`/public/events/${event.id}`}
                  />
                </Motion.div>
              ))}
            </Motion.div>

            {events.length === 0 && (
              <div className="text-center py-14">
                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-[20px] flex items-center justify-center mx-auto mb-4">
                  <CalendarX2 size={28} className="text-slate-400" />
                </div>
                <p className="font-semibold text-slate-500">No public events currently available.</p>
              </div>
            )}

            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-[#080b14] text-white font-bold py-4 px-10 rounded-[16px] hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                View All Events <ArrowRight size={18} />
              </Link>
            </Motion.div>
          </>
        )}
      </div>
    </section>
  );
}
