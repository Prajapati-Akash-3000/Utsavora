import React from "react";
import dayjs from "dayjs";
import DashboardCard from "./DashboardCard";

export default function UpcomingEvents({ events, onEventClick }) {
  return (
    <DashboardCard
      title="Upcoming Events"
      subtitle="Your accepted bookings that are coming up soon."
    >
      {events.length === 0 ? (
        <p className="text-sm text-slate-500">No upcoming events found.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {events.slice(0, 6).map((event, idx) => (
            <button
              type="button"
              key={event.id || idx}
              onClick={() => onEventClick && onEventClick(event)}
              className="w-full text-left group"
            >
              <div className="rounded-2xl border border-white/60 bg-white/60 hover:bg-white/75 transition p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">
                      {event.event || event.title || event.event_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {event.start_date &&
                      event.end_date &&
                      event.start_date !== event.end_date
                        ? `${dayjs(event.start_date).format(
                            "DD MMM"
                          )} - ${dayjs(event.end_date).format("DD MMM YYYY")}`
                        : event.date
                        ? dayjs(event.date).format("DD MMM YYYY")
                        : "No date"}
                      {event.city ? ` • ${event.city}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/15">
                    Upcoming
                  </span>
                </div>
              </div>
            </button>
          ))}
          {events.length > 6 && (
            <p className="text-xs text-slate-500 pt-1">
              Showing 6 of {events.length}.
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
