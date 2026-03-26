import { motion as Motion } from "framer-motion";
import { Star, CalendarCheck, Users, BadgeCheck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function SocialProofSection() {
  const stats = [
    { value: "4.8", label: "Average Rating", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { value: "10,000+", label: "Events Hosted", icon: CalendarCheck, color: "text-indigo-500", bg: "bg-indigo-50" },
    { value: "50,000+", label: "Happy Guests", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: "500+", label: "Event Managers", icon: BadgeCheck, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <Motion.h2 
            {...fadeUp}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Trusted by thousands of <br/> planners & attendees
          </Motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
              </Motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
