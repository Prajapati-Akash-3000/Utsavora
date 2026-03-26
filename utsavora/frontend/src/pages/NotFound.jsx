import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light text-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none gradient-text select-none">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 -mt-4 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-primary px-8 py-3.5 text-base"
        >
          <ArrowLeft size={18} /> Go Home
        </Link>
      </motion.div>
    </div>
  );
}
