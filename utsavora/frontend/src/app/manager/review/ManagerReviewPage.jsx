import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { handleApiError } from "../../../utils/handleApiError";

export default function ManagerReviewPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviewed, setUserReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingReview = async () => {
      if (!user) return;
      try {
        const res = await api.get("/reviews/");
        const found = res.data.find((r) => {
          if (user.id) return r.reviewer_id === user.id;
          if (user.email) return (r.reviewer_email || "").toLowerCase() === user.email.toLowerCase();
          return false;
        });
        if (found) {
          setUserReviewed(true);
        }
      } catch (error) {
        console.error("Error checking reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingReview();
  }, [user]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/reviews/", {
        rating: parseInt(rating),
        comment
      });
      toast.success("Review submitted successfully!");
      setComment("");
      setUserReviewed(true);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mt-20"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Platform Feedback</h1>

      {userReviewed ? (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center gap-4 text-green-800 shadow-sm">
          <span className="text-3xl">🎉</span>
          <div>
            <h3 className="font-bold text-lg mb-1">Feedback Received</h3>
            <p>You have already submitted a review for the Utsavora platform. Thank you for helping us improve!</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Review Utsavora Platform</h2>
          <p className="text-gray-500 mb-6">Your feedback helps us build a better experience for all managers and clients.</p>

          <form onSubmit={submitReview}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overall Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50"
            >
              <option value="5">⭐️⭐️⭐️⭐️⭐️ (Excellent)</option>
              <option value="4">⭐️⭐️⭐️⭐️ (Very Good)</option>
              <option value="3">⭐️⭐️⭐️ (Good)</option>
              <option value="2">⭐️⭐️ (Fair)</option>
              <option value="1">⭐️ (Poor)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Share your experience as a manager
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 p-4 rounded-lg min-h-[160px] focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 resize-y"
              placeholder="What do you love? What could we improve?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md active:scale-[0.98] ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
          </form>
        </div>
      )}
    </div>
  );
}
