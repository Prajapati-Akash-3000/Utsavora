import { motion as Motion } from "framer-motion";
import { Sparkles, Briefcase, MailOpen, Compass } from "lucide-react";

const features = [
  {
    title: "Smart Event Planning",
    icon: Sparkles,
    desc: "Create and manage events effortlessly with a modern, intuitive dashboard that keeps everything organized.",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    title: "Hire Professional Managers",
    icon: Briefcase,
    desc: "Connect with experienced, verified event managers for seamless planning and execution.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Beautiful Invitations",
    icon: MailOpen,
    desc: "Generate stunning digital invitations with customizable templates in seconds—ready to share.",
    gradient: "from-purple-500 to-pink-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border border-indigo-100">
            <Compass size={14} className="text-indigo-500" />
            Why Utsavora
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mt-2 leading-[1.1]">
            Everything You Need to Plan <br/>
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Perfect Events</span>
          </h2>
        </Motion.div>

        <Motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Motion.div
                key={index}
                variants={item}
                className="group relative p-8 lg:p-12 rounded-[32px] bg-white border border-slate-100 hover:border-primary/20 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white z-0 pointer-events-none" />
                <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                  <Icon size={28} className="text-white drop-shadow-sm" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{feature.desc}</p>
              </Motion.div>
            );
          })}
        </Motion.div>
      </div>
    </section>
  );
}
