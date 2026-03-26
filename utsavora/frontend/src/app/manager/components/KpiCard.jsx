import MotionCard from "../../../components/common/MotionCard";

export default function KpiCard({
  label,
  value,
  icon,
  tone = "indigo", // indigo | emerald | blue | amber | rose | violet
  helper,
}) {
  const tones = {
    indigo: {
      ring: "ring-indigo-500/15",
      icon: "bg-indigo-500/10 text-indigo-700",
      value: "text-indigo-700",
    },
    emerald: {
      ring: "ring-emerald-500/15",
      icon: "bg-emerald-500/10 text-emerald-700",
      value: "text-emerald-700",
    },
    blue: {
      ring: "ring-blue-500/15",
      icon: "bg-blue-500/10 text-blue-700",
      value: "text-blue-700",
    },
    amber: {
      ring: "ring-amber-500/15",
      icon: "bg-amber-500/10 text-amber-800",
      value: "text-amber-700",
    },
    rose: {
      ring: "ring-rose-500/15",
      icon: "bg-rose-500/10 text-rose-700",
      value: "text-rose-700",
    },
    violet: {
      ring: "ring-violet-500/15",
      icon: "bg-violet-500/10 text-violet-700",
      value: "text-violet-700",
    },
  };

  const t = tones[tone] ?? tones.indigo;

  return (
    <MotionCard className={`glass-card rounded-2xl p-5 sm:p-6 ring-1 ${t.ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {label}
          </p>
          <div className={`mt-2 text-2xl sm:text-3xl font-black ${t.value}`}>
            {value}
          </div>
          {helper && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">{helper}</p>
          )}
        </div>
        {icon && (
          <div
            className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center ${t.icon}`}
          >
            {icon}
          </div>
        )}
      </div>
    </MotionCard>
  );
}

