import { useNavigate } from "react-router-dom";
import MotionCard from "../../components/common/MotionCard";
import { Ticket, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export default function EventRegisterCard({ event }) {
  const navigate = useNavigate();
  const isFree = event.pricing_type === 'FREE';

  const handleRegisterClick = () => {
    navigate(`/public/events/${event.id}/register`);
  };

  return (
    <MotionCard className="bg-white rounded-[24px] shadow-sm shadow-indigo-500/5 p-6 md:p-8 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
      
      {/* Decorative top pulse */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary opacity-80" />
      
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 mt-2 relative">
          <Ticket size={28} />
          {/* Subtle glow ring */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10 animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2">
        {isFree ? "Reserve Your Spot" : "Get Your Tickets"}
      </h2>
      
      <p className="text-slate-500 text-sm mb-8 px-4 leading-relaxed">
        {isFree 
          ? "This is a free event, but spots are limited. Secure your entry by registering now." 
          : "Join us for an unforgettable experience. Purchase your tickets securely."}
      </p>

      <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-200/60 mb-8 relative">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Tag size={18} />
                  <span>Ticket Price</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                  {isFree ? "Free" : `₹${Number(event.registration_fee).toLocaleString('en-IN')}`}
              </div>
          </div>
      </div>

      <button
        onClick={handleRegisterClick}
        className="w-full relative group overflow-hidden bg-gradient-to-r from-[#5B5FFF] to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-[#5B5FFF]/25 flex items-center justify-center gap-2"
      >
        <span className="relative z-10 flex items-center gap-2">
            Proceed to Checkout
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
        {/* Shine effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
      </button>
      
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6 font-medium">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>100% Secure Checkout</span>
      </div>
    </MotionCard>
  );
}
