import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 px-6 lg:px-8 bg-slate-50 border-t border-slate-100">
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-[#080b14] min-h-[300px] rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
      >
        {/* Deep Glows */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] pointer-events-none animate-pulse-soft mix-blend-screen" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none dot-pattern" />

        <Motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black mb-4 tracking-tight relative z-10 drop-shadow-md leading-[1.1]"
        >
          Ready to Plan Your Next Event?
        </Motion.h2>
        <Motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-300 text-lg md:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed relative z-10 font-medium"
        >
          Create your event today, generate stunning invitations, and make it absolutely unforgettable.
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
        >
          <Link
            to="/user/create-event"
            className="group relative overflow-hidden bg-white text-indigo-700 font-black px-10 py-4 rounded-[16px] text-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">Create Event <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
             <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-indigo-600/10 to-transparent skew-x-12 z-0" />
          </Link>
          <Link
            to="/events"
            className="bg-transparent text-white border-[3px] border-white/20 font-bold px-10 py-4 rounded-[16px] text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            Explore Events
          </Link>
        </Motion.div>
      </Motion.div>
    </section>
  );
}
