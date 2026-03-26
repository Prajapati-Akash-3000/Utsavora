import { useEffect, useState } from "react";
import api from "../services/api";
import ReviewForm from "../components/reviews/ReviewForm";
import PageWrapper from "../components/common/PageWrapper";
import { useAuth } from "../context/AuthContext";
import { Star, MessageCircleHeart, CheckCircle2, Quote, Calendar } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReviewed, setUserReviewed] = useState(false);
  const { user } = useAuth();

  const loadReviews = async () => {
    try {
      const res = await api.get("/reviews/");
      setReviews(res.data);
      
      if (user) {
        const already = res.data.find((r) => {
          if (user.id) return r.reviewer_id === user.id;
          if (user.email) return (r.reviewer_email || "").toLowerCase() === user.email.toLowerCase();
          return false;
        });
        if (already) setUserReviewed(true);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [user]);

  // Framer Motion Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageWrapper className="bg-slate-50 min-h-screen pb-24">
      {/* Immersive Header */}
      <div className="relative w-full py-20 lg:py-32 bg-[#080b14] overflow-hidden flex flex-col items-center justify-center text-center px-6">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-[#080b14]/40 pointer-events-none" />

          <Motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-3xl mx-auto"
          >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                  <MessageCircleHeart size={14} className="text-pink-400" />
                  <span>Community Voices</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tight leading-tight">
                  Wall of Love
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                  Hear what thousands of organizers, managers, and attendees have to say about their experience with Utsavora.
              </p>
          </Motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">

        {/* REVIEWS LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Sidebar: Rating Summary */}
            <div className="lg:col-span-4 order-last lg:order-first">
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                >
                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-6xl font-black text-slate-900 leading-none">4.7</span>
                        <div className="flex flex-col mb-1.5">
                            <div className="flex gap-0.5 text-amber-400">
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" className="text-amber-400/30" />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Average Rating based on {reviews.length > 0 ? reviews.length + 120 : "1,200+"} reviews</p>
                    
                    {/* Rating Bars */}
                    <div className="space-y-3 mb-8">
                        {[
                           { stars: 5, pct: 85 },
                           { stars: 4, pct: 10 },
                           { stars: 3, pct: 3 },
                           { stars: 2, pct: 1 },
                           { stars: 1, pct: 1 },
                        ].map((row) => (
                           <div key={row.stars} className="flex items-center gap-3">
                               <div className="flex items-center gap-1 w-12 shrink-0">
                                   <span className="text-sm font-bold text-slate-700">{row.stars}</span>
                                   <Star size={14} className="text-amber-400" fill="currentColor" />
                               </div>
                               <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                               </div>
                           </div>
                        ))}
                    </div>

                    {user && !userReviewed ? (
                        <div className="border-t border-slate-100 pt-8 mt-4">
                           <h4 className="font-black text-xl mb-4 text-slate-900">Share your experience</h4>
                           <ReviewForm onReviewAdded={loadReviews} />
                        </div>
                    ) : userReviewed ? (
                        <div className="border-t border-slate-100 pt-8 mt-4">
                           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-800">
                               <CheckCircle2 size={24} className="shrink-0 text-emerald-500" />
                               <p className="font-bold text-sm">You have submitted a review. Thank you for your feedback!</p>
                           </div>
                        </div>
                    ) : null}
                </Motion.div>
            </div>

            {/* Right Column: Reviews Grid */}
            <div className="lg:col-span-8 pt-8 lg:pt-0">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                        <MessageCircleHeart size={40} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No written reviews yet</h3>
                        <p className="text-slate-500 font-medium pb-4">Check back soon for latest community feedback.</p>
                    </div>
                ) : (
                    <Motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                    {reviews.map((r) => (
                        <Motion.div
                        key={r.id}
                        variants={item}
                        className="group bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 py-8 transition-all duration-300 relative flex flex-col h-full"
                        >
                        <Quote size={80} className="absolute top-4 right-4 text-slate-50 opacity-60 pointer-events-none group-hover:text-indigo-50 transition-colors" />

                        {/* Stars */}
                        <div className="flex gap-1 mb-5 relative z-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={18} 
                                    className={star <= r.rating ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "fill-slate-100 text-slate-100"} 
                                />
                            ))}
                        </div>

                        <p className="text-slate-700 leading-relaxed italic relative z-10 mb-8 font-medium text-[15px] flex-1">
                            "{r.comment}"
                        </p>
                        
                        <div className="pt-6 border-t border-slate-100 mt-auto flex justify-between items-end relative z-10">
                            <div>
                                <h4 className="font-black text-slate-900 text-base leading-tight mb-1">
                                    {r.reviewer_name || "Anonymous"}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-widest">
                                        {r.role_label || r.role || "Event Manager"} {/* Fallback to simulate tags */}
                                    </span>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar size={12} className="text-slate-300" />
                                {new Date(r.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        </Motion.div>
                    ))}
                    </Motion.div>
                )}
            </div>
            
        </div>
      </div>
    </PageWrapper>
  );
}
