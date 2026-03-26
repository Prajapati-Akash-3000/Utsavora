import { motion as Motion } from "framer-motion";
import { Sparkles, Users, Flag, Heart, Target, Lightbulb, Compass, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import CTASection from "../../marketing/sections/CTASection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
};

const values = [
  { icon: Lightbulb, title: "Innovation", text: "We constantly redefine the boundaries of event technology to bring you smarter, faster solutions.", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Heart, title: "Trust", text: "Security and reliability are at our core. Your events, payments, and data are always protected.", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Users, title: "Community", text: "We believe in the power of bringing people together to forge unforgettable connections.", color: "text-indigo-500", bg: "bg-indigo-50" },
];

const timeline = [
  { year: "2024", phase: "The Idea", desc: "Utsavora was born from the realization that event planning was too fragmented and stressful." },
  { year: "2025", phase: "Development", desc: "We built the core engine, connecting hosts with professional managers and seamless ticketing." },
  { year: "2026", phase: "The Launch", desc: "Officially launched to the public, empowering thousands of planners worldwide." },
];

export default function About() {
  return (
    <PageWrapper className="bg-slate-50 min-h-screen">
      
      {/* Immersive Header */}
      <section className="relative w-full py-24 lg:py-32 bg-[#080b14] overflow-hidden text-center px-6">
          <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

          <Motion.div {...fadeUp} className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                  <Flag size={14} className="text-emerald-400" />
                  <span>Our Origin</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-8 tracking-tight leading-tight">
                 Elevating the art of <br/> <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">bringing people together.</span>
              </h1>
          </Motion.div>
      </section>

      {/* Story & Mission Split Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 -mt-16">
         <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
               
               {/* Why Utsavora Exists */}
               <Motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.7 }}>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Target size={24} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Story</h2>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 leading-relaxed">Why Utsavora exists.</h3>
                  <div className="space-y-4 text-slate-500 font-medium leading-loose text-[17px]">
                      <p>For years, organizing an event meant juggling scattered spreadsheets, disconnected payment gateways, tracking RSVPs via text messages, and manually hunting for event managers. The joy of the celebration was often overshadowed by the stress of planning.</p>
                      <p>We created Utsavora to change that. By unifying every aspect of event management—from beautiful invitations to secure escrow payments and reliable manager discovery—we built a platform that lets you focus on what truly matters: your guests.</p>
                  </div>
               </Motion.div>

               {/* Mission */}
               <Motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.7 }} className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-[40px] pointer-events-none" />
                  <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <Compass size={24} />
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Mission</h2>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-black text-slate-800 mb-6 leading-snug">
                          Making event planning <span className="text-emerald-600">effortless and joyful</span> for everyone.
                      </h3>
                      <p className="text-slate-500 font-medium leading-loose text-[17px] mb-8">
                          Our mission is to democratize professional event planning. We want anyone, regardless of their budget or technical skill, to be able to host world-class events seamlessly using our powerful, intuitive tools.
                      </p>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500">
                         <p className="text-slate-700 font-bold italic">
                            "When the logistics fade into the background, true connections can take center stage."
                         </p>
                      </div>
                  </div>
               </Motion.div>
            </div>
         </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Motion.div {...fadeUp} className="text-center mb-16">
                <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-slate-300 text-sm font-bold tracking-[0.1em] uppercase mb-4">
                  Core Values
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">What drives us forward</h2>
            </Motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
               {values.map((v, i) => {
                 const Icon = v.icon;
                 return (
                   <Motion.div 
                     key={v.title}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: i * 0.15 }}
                     className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group"
                   >
                       <div className={`w-16 h-16 rounded-[20px] ${v.bg} border-4 border-slate-900 ${v.color} flex items-center justify-center mb-8 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                           <Icon size={28} />
                       </div>
                       <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{v.title}</h3>
                       <p className="text-slate-400 font-medium leading-relaxed">{v.text}</p>
                   </Motion.div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* Premium Animated Timeline */}
      <section className="py-32 bg-white relative">
         <div className="max-w-4xl mx-auto px-6">
            <Motion.div {...fadeUp} className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Journey So Far</h2>
            </Motion.div>
            
            <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 max-w-full bg-slate-100 -translate-x-1/2" />
                
                <div className="space-y-16">
                   {timeline.map((step, index) => {
                      const isLeft = index % 2 === 0;
                      return (
                        <Motion.div 
                           key={step.year}
                           initial={{ opacity: 0, y: 40 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, margin: "-100px" }}
                           transition={{ duration: 0.7, delay: 0.1 }}
                           className={`relative flex flex-col md:flex-row items-center justify-between w-full outline-none group`}
                        >
                           {/* Timeline Node */}
                           <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-indigo-500 -translate-x-1/2 shadow-[0_0_0_8px_rgba(255,255,255,1)] group-hover:scale-125 group-hover:bg-indigo-50 transition-all duration-300 z-10" />

                           {/* Content Box */}
                           <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:order-last md:pl-12 md:text-left'}`}>
                               <div className="bg-slate-50 border border-slate-100 p-8 rounded-[24px] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-1 group-hover:border-indigo-500/20 transition-all duration-500">
                                  <div className={`text-5xl font-black text-indigo-500/10 mb-[-20px] select-none ${isLeft ? 'md:mr-[-10px]' : 'md:ml-[-10px]'}`}>
                                     {step.year}
                                  </div>
                                  <div className="relative z-10">
                                     <h3 className="text-2xl font-black text-slate-900 mb-3">{step.phase}</h3>
                                     <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                  </div>
                               </div>
                           </div>
                           
                           {/* Spacer for alternating layout */}
                           <div className="hidden md:block w-5/12" />
                        </Motion.div>
                      )
                   })}
                </div>
            </div>
         </div>
      </section>

      <CTASection />
    </PageWrapper>
  );
}
