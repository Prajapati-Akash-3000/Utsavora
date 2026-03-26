import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Search, Calendar, MapPin, Sparkles, Filter, Tag } from "lucide-react";
import EventCard from "../../marketing/sections/EventCard";
import CTASection from "../../marketing/sections/CTASection";
import Section from "../../marketing/sections/Section";
import { getPublicEvents } from "../../services/eventService";
import { Link } from "react-router-dom";

export default function PublicEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCity, setActiveCity] = useState("All");
  const [activePrice, setActivePrice] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getPublicEvents();
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Extract unique cities
  const cities = ["All", ...new Set(events.map(e => e.city).filter(Boolean))];
  const categories = ["All", "Wedding", "Corporate", "Social", "Music", "Others"];

  const filteredEvents = events.filter(e => {
    const q = searchQuery?.toLowerCase() || "";
    const titleMatch = String(e.title || "").toLowerCase().includes(q);
    const venueMatch = String(e.venue || "").toLowerCase().includes(q);
    
    const catMatch = activeCategory === "All" || String(e.category || e.template_details?.category).toLowerCase() === activeCategory.toLowerCase();
    const cityMatch = activeCity === "All" || String(e.city).toLowerCase() === activeCity.toLowerCase();
    const priceMatch = activePrice === "All" || String(e.pricing_type).toUpperCase() === activePrice.toUpperCase();

    return (titleMatch || venueMatch) && catMatch && cityMatch && priceMatch;
  });

  const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;
  const gridEvents = featuredEvent ? filteredEvents.slice(1) : filteredEvents;

  return (
    <div className="bg-slate-50 min-h-screen">
        {/* Banner */}
        <section className="relative bg-[#080b14] text-white pt-24 pb-32 px-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto text-center relative z-10 pt-10">
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight">
                        Discover & Join <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
                            Extraordinary Events
                        </span>
                    </h1>
                </Motion.div>
                
                {/* Advanced Filter Bar */}
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-12 max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-3 flex flex-col md:flex-row items-center shadow-2xl gap-3"
                >
                    <div className="flex-1 w-full relative flex items-center bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:bg-white/10 focus-within:border-white/30 transition-all">
                        <Search className="text-slate-400 shrink-0" size={20} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..." 
                            className="w-full bg-transparent border-none outline-none px-3 text-white placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto scrollbar-hide shrink-0 pb-1 md:pb-0">
                       <select 
                          value={activeCity} onChange={e => setActiveCity(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-medium outline-none shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
                       >
                          <option value="All" className="text-slate-900">Any City</option>
                          {cities.filter(c => c !== "All").map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                       </select>

                       <select 
                          value={activeCategory} onChange={e => setActiveCategory(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-medium outline-none shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
                       >
                          {categories.map(c => <option key={c} value={c} className="text-slate-900">{c === "All" ? "Any Category" : c}</option>)}
                       </select>

                       <select 
                          value={activePrice} onChange={e => setActivePrice(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-medium outline-none shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
                       >
                          <option value="All" className="text-slate-900">Any Price</option>
                          <option value="FREE" className="text-slate-900">Free</option>
                          <option value="PAID" className="text-slate-900">Paid</option>
                       </select>
                    </div>
                </Motion.div>
            </div>
        </section>

        <Section className="-mt-16 relative z-20 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                
                {loading ? (
                   // Reduced loading shimmer to single block
                   <div className="animate-pulse bg-white rounded-3xl h-[400px] w-full shadow border border-slate-100 flex items-center justify-center">
                       <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                ) : (
                   <>
                      {/* Featured Event */}
                      {featuredEvent && (
                        <Motion.div 
                           initial={{ opacity: 0, scale: 0.98 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="mb-16 group bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-100 flex flex-col lg:flex-row relative z-10 hover:-translate-y-1 transition-transform duration-500"
                        >
                           <div className="lg:w-3/5 h-[300px] lg:h-auto relative overflow-hidden shrink-0">
                               <img 
                                 src={featuredEvent.template_details?.background_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
                                 alt={featuredEvent.title} 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 lg:bg-gradient-to-r lg:from-transparent lg:to-black/60 to-transparent" />
                               <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                 FEATURED EVENT
                               </div>
                           </div>
                           <div className="p-8 lg:p-12 flex flex-col justify-center flex-1 bg-white relative">
                               <div className="flex gap-3 mb-4">
                                  {featuredEvent.category && <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{featuredEvent.category}</span>}
                                  {featuredEvent.pricing_type === "FREE" && <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">FREE</span>}
                               </div>
                               <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{featuredEvent.title}</h2>
                               <div className="flex flex-col gap-3 text-slate-500 font-medium mb-8">
                                  <div className="flex items-center gap-2"><Calendar size={18} className="text-indigo-400"/> {new Date(featuredEvent.start_date || new Date()).toLocaleDateString('en-US', {weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'})}</div>
                                  <div className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400"/> {[featuredEvent.venue, featuredEvent.city].filter(Boolean).join(", ")}</div>
                               </div>
                               <Link to={`/public/events/${featuredEvent.id}`} className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl text-center shadow-lg hover:bg-indigo-600 transition-colors hover:shadow-indigo-500/25">
                                  View Event Details
                               </Link>
                           </div>
                        </Motion.div>
                      )}

                      {/* Event Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                          {gridEvents.map((event, index) => (
                              <Motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, margin: "-50px" }}
                                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                              >
                                  <EventCard 
                                      title={event.title}
                                      date={event.start_date
                                          ? new Date(event.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                                          : "Date TBA"
                                      }
                                      location={[event.venue, event.city].filter(Boolean).join(', ') || "Location TBA"}
                                      image={event.template_details?.background_image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop`}
                                      tag={event.template_details?.category || event.category}
                                      pricingType={event.pricing_type}
                                      price={event.registration_fee}
                                      link={`/public/events/${event.id}`}
                                  />
                              </Motion.div>
                          ))}
                      </div>
                      
                      {filteredEvents.length === 0 && (
                          <Motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-24 text-gray-500 bg-white shadow-sm rounded-3xl border border-slate-100 max-w-2xl mx-auto mb-20"
                          >
                              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Search size={32} className="text-slate-300" />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-800 mb-2">No events found</h3>
                              <p className="text-slate-500">We couldn't find any events matching your advanced filters.<br/>Try adjusting your criteria.</p>
                          </Motion.div>
                      )}
                   </>
                )}
            </div>
        </Section>
        <CTASection />
    </div>
  );
}
