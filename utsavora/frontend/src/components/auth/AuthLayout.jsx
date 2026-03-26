import { motion as Motion } from "framer-motion";
import brandIcon from "../../assets/brand/utsavora-icon.svg";
import { Link } from "react-router-dom";

/**
 * Shared wrapper for ALL auth pages.
 * Provides the mesh-gradient background, centering, and branding.
 */
export default function AuthLayout({ children, brandingHint }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden bg-slate-50">
      {/* Mesh gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-50/40 blur-3xl" />
      </div>

      {/* Top-left branding */}
      <Motion.div
        className="absolute top-5 left-6 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <img src={brandIcon} alt="Utsavora" className="h-7 w-7 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div>
            <span className="font-black text-slate-800 text-sm tracking-tight">Utsavora</span>
            {brandingHint && (
              <p className="text-[11px] font-semibold text-slate-400 -mt-0.5">{brandingHint}</p>
            )}
          </div>
        </Link>
      </Motion.div>

      {/* Page content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
