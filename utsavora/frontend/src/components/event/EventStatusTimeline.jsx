import React from "react";

export default function EventStatusTimeline({ event }) {
  if (!event) return null;

  // Resolve logical steps
  const parseDateOnly = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('T')[0].split('-');
    return new Date(y, m - 1, d);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventEndDate = parseDateOnly(event.end_date || event.end_datetime || event.event_date);
  if (eventEndDate) eventEndDate.setHours(0, 0, 0, 0);

  // Resolve logical steps: Only completed if status is set or the day HAS PASSED
  const isCompleted = event.status === "COMPLETED" || (eventEndDate && today > eventEndDate);
  const managerBooked = event.booking && ["ACCEPTED", "CONFIRMED"].includes(event.booking.status);
  const paymentCompleted = event.booking && event.booking.payment_status === "FULLY_PAID";
  
  const steps = [
    {
      id: 1,
      label: "Event Created",
      description: "You have successfully created the event.",
      isCompleted: true, // Always true if it exists
      isActive: false
    },
    {
      id: 2,
      label: "Manager Assigned",
      description: managerBooked ? "A manager has accepted your booking." : "Waiting for manager to accept.",
      isCompleted: managerBooked,
      isActive: !managerBooked // Active if we are waiting on this
    },
    {
      id: 3,
      label: "Payment Completed",
      description: paymentCompleted ? "All payments have been cleared." : "Pending final or advance payment.",
      isCompleted: paymentCompleted,
      isActive: managerBooked && !paymentCompleted
    },
    {
      id: 4,
      label: "Event Upcoming",
      description: (managerBooked || paymentCompleted) && !isCompleted ? "Event is scheduled and ready." : "",
      isCompleted: isCompleted,
      isActive: (paymentCompleted || managerBooked) && !isCompleted
    },
    {
      id: 5,
      label: "Event Completed",
      description: isCompleted ? "The event has concluded." : "",
      isCompleted: isCompleted,
      isActive: isCompleted
    }
  ];

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map((step, stepIdx) => (
          <li key={step.id}>
            <div className="relative pb-8">
              {stepIdx !== steps.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
              ) : null}
              
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white transition-colors duration-300 ${
                      step.isCompleted ? 'bg-green-500' : step.isActive ? 'bg-purple-600' : 'bg-gray-200 border-2 border-gray-300'
                  }`}>
                    {step.isCompleted ? (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : step.isActive ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                    ) : null}
                  </span>
                </div>
                
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className={`text-sm font-medium ${step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {step.description && (
                       <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
