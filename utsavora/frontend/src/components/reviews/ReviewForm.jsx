import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function ReviewForm({ onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating by clicking a star");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please share your thoughts in the comment section");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/reviews/", {
        rating: rating,
        comment,
      });
      setSuccess(true);
      toast.success("Thank you for your review!");
      setComment("");
      setRating(0);
      setTimeout(() => {
          if (onReviewAdded) onReviewAdded();
      }, 1500);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (val) => {
      switch(val) {
          case 1: return "Poor";
          case 2: return "Fair";
          case 3: return "Good";
          case 4: return "Very Good";
          case 5: return "Excellent";
          default: return "Select a rating";
      }
  };

  if (success) {
      return (
        <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-emerald-100 flex flex-col items-center justify-center text-center space-y-4"
        >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Review Submitted!</h3>
            <p className="text-slate-500 font-medium">Thank you for sharing your experience with the Utsavora community.</p>
        </Motion.div>
      )
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
      {/* Decorative pulse */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary opacity-80" />
      
      <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
              <MessageSquareQuote size={24} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">Leave a Review</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Your feedback helps us improve.</p>
          </div>
      </div>
      
      <form onSubmit={submitReview}>
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Overall Experience
          </label>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setRating(star)}
                    >
                        <Star 
                            size={32} 
                            className={`transition-all duration-300 ${
                                (hoverRating || rating) >= star 
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                                : 'text-slate-200 fill-slate-50'
                            }`}
                        />
                    </button>
                ))}
              </div>
              <span className={`text-sm font-bold ml-2 transition-colors duration-300 ${rating || hoverRating ? 'text-amber-500' : 'text-slate-400'}`}>
                  {getRatingText(hoverRating || rating)}
              </span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Your Thoughts
          </label>
          <textarea
            placeholder="What did you love? How can we do better?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-slate-200 bg-slate-50/50 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 min-h-[140px] resize-none text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full relative group overflow-hidden bg-gradient-to-r from-[#5B5FFF] to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg shadow-[#5B5FFF]/25 flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span className="relative z-10">
              {isSubmitting ? "Submitting..." : "Post Review"}
          </span>
          {/* Shine effect on hover */}
          {!isSubmitting && <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />}
        </button>
      </form>
    </div>
  );
}
