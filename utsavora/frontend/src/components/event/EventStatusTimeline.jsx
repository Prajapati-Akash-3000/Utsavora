import React from "react";

const TIMELINE_STEPS = [
  { key: "CREATED", label: "Event Created" },
  { key: "ACTIVE", label: "Event Live" },
  { key: "PENDING", label: "Manager Requested" },
  { key: "CONFIRMED", label: "Manager Booked" },
  { key: "COMPLETED", label: "Event Completed" },
];

function resolveTimeline(event) {
  if (!event) return {};

  const isCompleted = event.status === "COMPLETED" || new Date() > new Date(event.end_date);
  
  return {
    CREATED: true,
    ACTIVE: event.status === "ACTIVE" || isCompleted || (event.manager_booking && ["PENDING", "CONFIRMED", "ACCEPTED"].includes(event.manager_booking.status)),
    PENDING: (event.manager_booking && ["PENDING", "CONFIRMED", "ACCEPTED"].includes(event.manager_booking.status)) || (event.manager_booking && event.manager_booking.status === "CONFIRMED"),
    CONFIRMED: (event.manager_booking && ["CONFIRMED", "ACCEPTED"].includes(event.manager_booking.status)) && event.manager_booking.payment_status === "PAID",
    COMPLETED: isCompleted,
  };
}

export default function EventStatusTimeline({ event }) {
  if (!event) return null;
  const state = resolveTimeline(event);

  return (
    <ol className="flex items-center justify-between w-full relative">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
      
      {TIMELINE_STEPS.map((step, index) => {
          const isActive = state[step.key];
          
          return (
            <li key={step.key} className="flex-1 text-center relative">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 transition-colors duration-300
                  ${isActive
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"}`}
              >
                {index + 1}
              </div>
              <p className={`mt-2 text-xs md:text-sm ${isActive ? "font-semibold text-green-600" : "text-gray-500"}`}>
                {step.label}
              </p>
            </li>
          );
      })}
    </ol>
  );
}
