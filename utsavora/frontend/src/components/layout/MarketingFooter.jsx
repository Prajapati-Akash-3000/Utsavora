import { Link } from "react-router-dom";
import brandIcon from "../../assets/brand/utsavora-icon.svg";
import { Heart, ArrowRight, Mail, Instagram, Twitter, Linkedin, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300 text-sm py-1.5"
    >
      <span className="relative overflow-hidden">
        <span className="block transform transition-transform duration-300 group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute top-0 left-0 block transform transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-indigo-300">
          {children}
        </span>
      </span>
    </Link>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={label}
      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon size={16} className="relative z-10 group-hover:text-indigo-300 transition-colors duration-300" />
    </a>
  );
}

export default function MarketingFooter() {
  const { user } = useAuth();
  const ctaLink = user ? (user.role === "MANAGER" ? "/manager/dashboard" : "/user/my-events") : "/register";
  return (
    <footer className="relative border-t border-white/[0.06] bg-gradient-to-b from-[#0a0f1c] to-[#030712] overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40" />

      {/* Subtle Glow Effects */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/[0.06] rounded-full blur-[120px] pointer-events-none" />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-0">
        <div className="relative rounded-[24px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-indigo-900/80 to-slate-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_60%)]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8 md:px-12">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {user ? "Your dashboard awaits." : "Ready to plan your next event?"}
              </h3>
              <p className="mt-1.5 text-sm text-white/50 font-medium max-w-md">
                {user ? "Jump back in and manage your events, bookings, and more." : "Join thousands creating unforgettable experiences with Utsavora."}
              </p>
            </div>
            <Link
              to={ctaLink}
              className="group shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/[0.06]">
          
          {/* Brand & Newsletter (4/12) */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src={brandIcon} alt="Utsavora" className="h-10 w-10 relative z-10 transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300" />
              </div>
              <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Utsavora
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Premium event planning, custom invitations, and seamless management — built for elegance and unforgettable memories.
            </p>

            {/* Newsletter */}
            <div className="mt-2">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-3">Stay Updated</h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-[280px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={14} className="text-slate-500" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30 transition-all duration-300"
                  />
                </div>
                <button className="group flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                   <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Links (8/12) */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Company */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Company</h4>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/reviews">Reviews</FooterLink>
            </div>

            {/* Product */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Product</h4>
              <FooterLink to="/user/create-event">Create Event</FooterLink>
              <FooterLink to="/events">Public Events</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Support</h4>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-4">
               <h4 className="text-white font-bold tracking-wider uppercase text-[11px] mb-1">Connect</h4>
               <div className="flex gap-2.5">
                 <SocialLink href="https://instagram.com/utsavora" icon={Instagram} label="Instagram" />
                 <SocialLink href="https://twitter.com/utsavora" icon={Twitter} label="Twitter" />
                 <SocialLink href="https://linkedin.com/company/utsavora" icon={Linkedin} label="LinkedIn" />
               </div>
               <div className="mt-2 space-y-2.5">
                 <div className="flex items-center gap-2.5 text-slate-500 text-xs">
                   <MapPin size={13} className="text-slate-500 shrink-0" />
                   <span>Mumbai, India</span>
                 </div>
                 <a href="mailto:hello@utsavora.com" className="flex items-center gap-2.5 text-slate-500 text-xs hover:text-indigo-400 transition-colors">
                   <Mail size={13} className="shrink-0" />
                   <span>hello@utsavora.com</span>
                 </a>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold tracking-wide">Utsavora</span>
            <span className="text-slate-600 mx-1">·</span> All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span className="tracking-wide">Crafted with</span>
            <Heart size={12} className="text-red-400 fill-red-400 animate-pulse" />
            <span className="tracking-wide">in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
