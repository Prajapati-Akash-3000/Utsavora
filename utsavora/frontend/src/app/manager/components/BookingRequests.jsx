import React from "react";
import dayjs from "dayjs";
import DashboardCard from "./DashboardCard";
import Button from "../../../components/ui/Button";

export default function BookingRequests({ bookings, onAccept, onReject }) {
  return (
    <DashboardCard
      title="Pending Requests"
      subtitle="Review new booking requests and respond quickly."
    >
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No pending booking requests.</p>
      ) : (
        <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-white/60 bg-white/60 p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-800 truncate">{b.user_name}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/15">
                    New
                  </span>
                </div>
                <p className="text-sm font-bold text-violet-700 mt-1 truncate">
                  {b.package_name}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {b.event} •{" "}
                  {b.start_date && b.end_date && b.start_date !== b.end_date
                    ? `${dayjs(b.start_date).format("DD MMM")} - ${dayjs(
                        b.end_date
                      ).format("DD MMM")}`
                    : b.date
                    ? dayjs(b.date).format("DD MMM")
                    : "Unknown Date"}
                </p>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {b.venue}
                  {b.city ? `, ${b.city}` : ""}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  className="min-w-[86px]"
                  onClick={() => onAccept(b.id)}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="min-w-[86px]"
                  onClick={() => onReject(b.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
