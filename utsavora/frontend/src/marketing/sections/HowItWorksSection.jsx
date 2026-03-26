import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Briefcase, Camera } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Create Event",
    desc: "Set the date, location, and theme for your celebration in minutes with a beautiful interactive builder.",
    icon: Calendar,
    color: "from-blue-500 to-indigo-600",
    glowColor: "bg-indigo-500",
  },
  {
    id: "02",
    title: "Invite Guests",
    desc: "Send stunning digital invitations instantly, manage your guest list, and track RSVPs in real time.",
    icon: Users,
    color: "from-emerald-400 to-teal-500",
    glowColor: "bg-emerald-500",
  },
  {
    id: "03",
    title: "Hire Managers",
    desc: "Discover verified event professionals, review their portfolios, and securely clear payments digitally.",
    icon: Briefcase,
    color: "from-amber-400 to-orange-500",
    glowColor: "bg-amber-500",
  },
  {
    id: "04",
    title: "Capture Memories",
    desc: "Upload, share, and preserve high-quality event photos in your own private, dedicated gallery.",
    icon: Camera,
    color: "from-purple-500 to-pink-500",
    glowColor: "bg-fuchsia-500",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-[#050714] text-white relative overflow-hidden font-sans">
      {/* Immersive Background Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <Motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold tracking-[0.2em] uppercase mb-5 shadow-xl backdrop-blur-md"
            >
              Simple workflow
            </Motion.span>
            <Motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400"
            >
              How it works
            </Motion.h2>
          </div>
          <Motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mt-6 md:mt-0 text-lg md:text-xl font-medium max-w-md"
          >
            Four incredibly simple steps to plan, launch, and immortalize your perfect event.
          </Motion.p>
        </div>

        {/* 🚀 SPLIT VIEW LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: INTERACTIVE NAVIGATION TABS */}
          <div className="lg:col-span-5 flex flex-col space-y-4 relative">
            {/* Soft vertical connecting line */}
            <div className="absolute left-[2.25rem] md:left-[2.75rem] top-8 bottom-8 w-px bg-white/5 z-0 hidden sm:block" />

            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const Icon = step.icon;
              
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`relative z-10 group flex items-center gap-5 sm:gap-6 p-4 sm:p-5 rounded-[2rem] cursor-pointer transition-all duration-500 ease-out select-none
                    ${isActive 
                      ? 'bg-white/[0.08] border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transform scale-[1.02]' 
                      : 'hover:bg-white-[0.03] opacity-60 hover:opacity-100 hover:scale-[1.01]'
                    }
                  `}
                >
                  {/* Step Icon Badge */}
                  <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500
                    ${isActive 
                      ? `bg-gradient-to-br ${step.color} shadow-lg scale-110` 
                      : 'bg-[#151928] border border-white/5 text-slate-400 group-hover:bg-[#1a1f33]'
                    }
                  `}>
                    <Icon size={24} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                  </div>

                  {/* Step Text Summary */}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        Step {step.id}
                      </span>
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {step.title}
                    </h3>
                    
                    {/* Mobile minimal description (only shows when active on small screens) */}
                    <AnimatePresence>
                      {isActive && (
                        <Motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="lg:hidden pr-2 mt-2"
                        >
                          <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            {step.desc}
                          </p>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: DYNAMIC PRESENTATION STAGE (Desktop Focus) */}
          <div className="hidden lg:block lg:col-span-7 h-full">
            <div className="relative w-full h-[500px] xl:h-[600px] bg-[#0c0f1c] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] p-0">
              
              {/* Dynamic Ambient Background Glows */}
              <AnimatePresence mode="popLayout">
                <Motion.div
                  key={`bg-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] ${steps[activeStep].glowColor} pointer-events-none`}
                />
              </AnimatePresence>

              {/* Main Content Crossfade Canvas */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={`content-${activeStep}`}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center max-w-lg"
                  >
                    {/* Floating Hero Icon */}
                    <Motion.div 
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className={`w-32 h-32 rounded-[2rem] bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] mb-10 border border-white/20`}
                    >
                      {(() => {
                        const ActiveIcon = steps[activeStep].icon;
                        return <ActiveIcon size={56} className="text-white drop-shadow-lg" />;
                      })()}
                    </Motion.div>

                    {/* Step Huge Number Watermark */}
                    <div className="absolute top-10 right-10 text-[180px] font-black text-white/[0.02] leading-none pointer-events-none tracking-tighter mix-blend-overlay">
                      {steps[activeStep].id}
                    </div>

                    <span className={`text-sm font-black tracking-[0.2em] uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r ${steps[activeStep].color}`}>
                      Phase {steps[activeStep].id}
                    </span>
                    <h3 className="text-4xl xl:text-5xl font-black text-white mb-6 tracking-tight">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-lg xl:text-xl text-slate-400 font-medium leading-relaxed">
                      {steps[activeStep].desc}
                    </p>
                  </Motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
