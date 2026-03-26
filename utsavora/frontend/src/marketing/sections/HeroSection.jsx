import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { BadgeCheck, Calendar, MapPin, Users, Star } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] },
});

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#080b14] text-white">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b14]/80 via-[#080b14]/50 to-[#080b14]" />
      </div>

      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[160px] pointer-events-none animate-pulse-soft mix-blend-screen" />
      <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-indigo-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-soft mix-blend-screen" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none dot-pattern" />

      <div className="max-w-7xl mx-auto px-6 py-24 min-h-[80vh] flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* Left Content */}
          <Motion.div {...fadeUp()} className="space-y-6 text-center lg:text-left pt-10 lg:pt-0">
            <Motion.div
              {...fadeUp(0.1)}
              className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold tracking-[0.1em] uppercase backdrop-blur-md shadow-2xl"
            >
              <BadgeCheck size={14} className="text-primary-400" />
              The Ultimate Event Platform
            </Motion.div>

            <Motion.h1
              {...fadeUp(0.2)}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight drop-shadow-xl"
            >
              Plan unforgettable
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent"> events effortlessly.</span>
            </Motion.h1>

            <Motion.p
              {...fadeUp(0.3)}
              className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm"
            >
              Manage invitations, bookings, and memories — all in one place. Discover public events or create your own with premium tools.
            </Motion.p>

            <Motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link
                to="/user/create-event"
                className="relative group overflow-hidden px-8 py-4 bg-white text-indigo-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] text-center text-base flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Start Planning</span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-indigo-600/10 to-transparent skew-x-12 z-0" />
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl backdrop-blur-sm text-base"
              >
                Explore Events
              </Link>
            </Motion.div>

            {/* Avatar Stack Social Proof */}
            <Motion.div {...fadeUp(0.5)} className="pt-6 flex items-center justify-center lg:justify-start gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#080b14] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
               </div>
               <div className="text-sm text-slate-400 font-medium flex flex-col">
                  <div className="flex text-amber-400 gap-0.5"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                  <span>from 1,200+ reviews</span>
               </div>
            </Motion.div>
          </Motion.div>

          {/* Right 3D Styled Card Stack */}
          <Motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden md:block w-full max-w-[500px] mx-auto lg:ml-auto h-[500px] perspective-1000"
          >
             {/* Card 3 (Back) */}
             <div 
               className="absolute top-8 right-[-20px] w-full h-[320px] bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-[32px] border border-white/10 backdrop-blur-md transform rotate-6 scale-90 shadow-2xl animate-float"
             />
             {/* Card 2 (Middle) */}
             <div 
               className="absolute top-16 right-4 w-full h-[340px] bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-[32px] border border-white/10 backdrop-blur-md transform -rotate-3 scale-[0.95] shadow-2xl animate-float" style={{ animationDelay: '1s' }}
             />
             
             {/* Card 1 (Front - Event Preview) */}
             <Motion.div 
               whileHover={{ scale: 1.02, rotate: 0, y: -5 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="absolute top-24 left-0 w-full bg-white/10 border border-white/20 rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl group cursor-pointer"
             >
                <div className="w-full h-48 rounded-[20px] bg-slate-800/50 mb-6 overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" alt="Event preview" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30 truncate">
                      FEATURED EVENT
                   </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 break-words">Neon Nights Festival 2026</h3>
                <div className="flex gap-4 text-slate-300 text-sm font-medium mb-6 truncate">
                   <div className="flex items-center gap-1.5"><Calendar size={16} className="text-emerald-400"/> Oct 24</div>
                   <div className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-400"/> Cyber City</div>
                </div>
                <div className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-bold py-3.5 rounded-xl text-center shadow-lg group-hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all">
                   Join Event
                </div>
             </Motion.div>
          </Motion.div>

        </div>
      </div>
    </section>
  );
}
