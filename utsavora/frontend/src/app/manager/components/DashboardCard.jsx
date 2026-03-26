import MotionCard from "../../../components/common/MotionCard";

export default function DashboardCard({
  title,
  subtitle,
  actions,
  className = "",
  children,
}) {
  return (
    <MotionCard className={`glass-card rounded-2xl ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-5 sm:px-6 pt-5 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-2">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        </div>
      )}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">{children}</div>
    </MotionCard>
  );
}

