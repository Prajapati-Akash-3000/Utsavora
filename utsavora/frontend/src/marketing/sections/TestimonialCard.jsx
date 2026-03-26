import React from "react";
import { Star, Quote } from "lucide-react";

const TestimonialCard = React.memo(function TestimonialCard({ name, role, review, rating = 5 }) {
  return (
    <div className="group bg-white p-7 rounded-2xl shadow-card hover:shadow-card-hover border border-slate-100 hover:border-primary/20 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
      {/* Quote watermark */}
      <Quote size={48} className="absolute top-4 right-4 text-primary/[0.06]" />

      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        ))}
      </div>

      {/* Review Content */}
      <p className="text-slate-600 text-base leading-relaxed flex-1">
        "{review}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100/80">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEF2FF&color=5B5FFF&bold=true`}
          alt={`${name} profile`}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-primary/30 transition-all"
        />
        <div>
          <h4 className="font-bold text-slate-900 text-sm leading-none">{name}</h4>
          <p className="text-primary text-xs font-semibold mt-1">{role}</p>
        </div>
      </div>
    </div>
  );
});

export default TestimonialCard;
