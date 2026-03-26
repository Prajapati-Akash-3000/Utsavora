import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Heart } from "lucide-react";

const EventCard = React.memo(function EventCard({ image, tag, date, title, location, price, pricingType, link }) {
  const priceLabel = pricingType === "FREE"
    ? "Free Entry"
    : pricingType === "PAID" && price != null
    ? `₹${Number(price).toLocaleString('en-IN')}`
    : (price === 0 || price === "Free" || price === "0.00" || price === null || price === undefined)
    ? "Free Entry"
    : `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 flex flex-col h-full hover:-translate-y-1.5 cursor-pointer relative">

      {/* Image Header */}
      <div className="relative shrink-0 overflow-hidden h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b14]/80 via-transparent to-transparent opacity-80" />
        
        {tag && (
          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {tag}
          </div>
        )}
        <button 
          className="absolute top-4 right-4 w-9 h-9 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/90 hover:text-red-500 hover:border-transparent transition-all duration-300 z-10"
          title="Save Event"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle save logic here
          }}
        >
          <Heart size={16} />
        </button>

        {/* Floating Price Tag over Image */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
          {priceLabel}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1 bg-white relative z-10">
        <div className="flex items-center gap-2 text-[#5B5FFF] font-semibold text-xs mb-3 tracking-wide uppercase">
          <Calendar size={14} />
          <span>{date}</span>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#5B5FFF] group-hover:to-[#4F46E5] transition-all duration-300 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 mt-auto">
          <MapPin size={16} className="shrink-0 text-slate-400" />
          <span className="line-clamp-1 font-medium">{location}</span>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-slate-100 mt-auto shrink-0 transition-colors duration-300 group-hover:border-indigo-500/10">
          <Link
            to={link || "#"}
            className="w-full bg-slate-50 text-slate-700 border border-slate-200 group-hover:bg-gradient-to-r group-hover:from-[#5B5FFF] group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-[#5B5FFF]/25 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm"
          >
            View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
});

export default EventCard;
