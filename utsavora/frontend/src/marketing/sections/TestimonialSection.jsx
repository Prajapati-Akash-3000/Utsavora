import { motion as Motion } from "framer-motion";
import { Heart } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

const reviews = [
  {
    name: "Priya Sharma",
    role: "Recent Bride",
    rating: 5,
    review: "Utsavora made planning our wedding effortless. The invitation templates are gorgeous and the manager we hired was absolutely perfect!",
  },
  {
    name: "Rahul Mehta",
    role: "Corporate Event Host",
    rating: 5,
    review: "Amazing event managers and beautiful invitation cards. Our annual conference ran smoother than ever before.",
  },
  {
    name: "Ananya Patel",
    role: "Festival Organizer",
    rating: 5,
    review: "Public events registration was super smooth. We collected payments and managed 2000+ RSVPs without a single hitch.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function TestimonialSection() {
  return (
    <>
      {/* Dark header section */}
      <section className="relative bg-[#080b14] pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080b14]/60 via-[#080b14]/40 to-[#080b14]" />
        
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-400 text-sm font-bold tracking-wide mb-6 border border-white/10 shadow-lg backdrop-blur-sm">
            <Heart size={16} className="text-emerald-400" />
            Wall of Love
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
            Don't Just Take <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Our Word</span> For It
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl mx-auto">
            Join thousands of organizers who rely on Utsavora for spectacular events.
          </p>
        </Motion.div>

        {/* Trusted by logos */}
        <Motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-14 mt-16 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700 relative z-10"
        >
          {["Google", "Stripe", "Spotify", "Airbnb"].map((name) => (
            <span key={name} className="text-xl md:text-2xl font-black text-white tracking-wider hover:opacity-100 transition-opacity duration-300 cursor-pointer">{name}</span>
          ))}
        </Motion.div>
      </section>

      {/* Testimonial cards */}
      <section className="py-16 md:py-20 bg-slate-50 px-6 relative">
        <Motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10"
        >
          {reviews.map((review, index) => (
            <Motion.div key={index} variants={item}>
              <TestimonialCard {...review} />
            </Motion.div>
          ))}
        </Motion.div>
      </section>
    </>
  );
}
