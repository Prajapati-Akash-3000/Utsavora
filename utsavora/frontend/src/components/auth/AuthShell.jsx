import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import heroIllustration from "../../assets/illustrations/hero-event-planning.svg";
import AuthLayout from "./AuthLayout";

/**
 * Split-panel layout for Login / Register pages.
 * Left: form card. Right: dark storytelling panel.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  sideTitle = "Plan. Hire. Celebrate.",
  sideSubtitle = "Premium event planning tools, invitations, registrations, and secure payments—built for speed and elegance.",
  sideFeatures,
}) {
  const features = sideFeatures || [
    { icon: "mark_email_unread", label: "Invitations" },
    { icon: "badge", label: "Managers" },
    { icon: "payments", label: "Payments" },
    { icon: "event", label: "Registrations" },
  ];

  return (
    <AuthLayout>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Form card */}
        <Motion.div
          className="relative"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 blur-2xl rounded-[32px] pointer-events-none" aria-hidden="true" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-[24px] p-6 sm:p-8">
            <Motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{title}</h1>
              {subtitle && <p className="mt-1.5 text-slate-500 font-medium text-sm">{subtitle}</p>}
            </Motion.div>

            {children}

            {footer && (
              <Motion.div
                className="mt-6 pt-6 border-t border-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {footer}
              </Motion.div>
            )}
          </div>
        </Motion.div>

        {/* Side panel */}
        <Motion.div
          className="hidden lg:block relative"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
        >
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div className="absolute inset-0 rounded-[24px] dot-pattern opacity-10 pointer-events-none" />

          {/* Subtle floating orbs (CSS-animated, no JS overhead) */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
            <div
              className="absolute w-32 h-32 bg-indigo-400/[0.06] rounded-full -top-8 -right-8 blur-xl animate-float"
            />
            <div
              className="absolute w-24 h-24 bg-violet-400/[0.05] rounded-full bottom-24 left-10 blur-lg animate-float"
              style={{ animationDelay: '1.5s' }}
            />
          </div>

          <div className="relative h-full rounded-[24px] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 lg:p-10 text-white flex-1">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-bold tracking-wide uppercase"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Secure &amp; verified
              </Motion.div>
              <Motion.h2
                className="mt-6 text-3xl lg:text-4xl font-black tracking-tight leading-tight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {sideTitle}
              </Motion.h2>
              <Motion.p
                className="mt-3 text-white/60 font-medium leading-relaxed max-w-md text-sm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {sideSubtitle}
              </Motion.p>

              <Motion.div
                className="mt-8 space-y-2.5 max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((f, i) => (
                  <Motion.div
                    key={f.label}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.1] transition-colors"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-indigo-300">{f.icon}</span>
                    </div>
                    <span className="font-bold text-sm text-white/80">{f.label}</span>
                  </Motion.div>
                ))}
              </Motion.div>
            </div>

            <div className="px-8 lg:px-10 pb-8 lg:pb-10">
              <Motion.div
                className="rounded-[20px] bg-white/[0.06] border border-white/[0.08] p-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <img src={heroIllustration} alt="Utsavora preview" className="w-full h-auto rounded-2xl opacity-80" loading="lazy" />
              </Motion.div>
            </div>
          </div>
        </Motion.div>
      </div>
    </AuthLayout>
  );
}
