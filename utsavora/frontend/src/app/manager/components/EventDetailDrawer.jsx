import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function EventDetailDrawer({ isOpen, onClose, event }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {event ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {event.event || event.title || event.event_name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {event.status || "CONFIRMED"}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                     <div className="flex justify-between">
                       <span className="text-gray-500">Dates</span>
                       <div className="text-right">
                         <span className="font-medium text-gray-900 block">
                            {event.start_date && event.end_date 
                              ? `${dayjs(event.start_date).format("DD MMM")} - ${dayjs(event.end_date).format("DD MMM YYYY")}`
                              : event.date ? dayjs(event.date).format("DD MMM YYYY") : "Unknown"}
                         </span>
                         {(event.start_time || event.end_time) && (
                           <span className="text-xs text-gray-500 block">
                             {event.start_time ? dayjs(`2000-01-01T${event.start_time}`).format("h:mm A") : ""} 
                             {event.start_time && event.end_time ? " to " : ""}
                             {event.end_time ? dayjs(`2000-01-01T${event.end_time}`).format("h:mm A") : ""}
                           </span>
                         )}
                       </div>
                     </div>
                     <div className="flex justify-between border-t border-gray-100 pt-2">
                       <span className="text-gray-500">Client</span>
                       <div className="text-right">
                          <p className="font-medium text-gray-900">{event.user_name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{event.user_email}</p>
                          <p className="text-xs font-semibold text-purple-600">{event.user_mobile || "No Mobile"}</p>
                       </div>
                     </div>
                     <div className="flex justify-between border-t border-gray-100 pt-2">
                       <span className="text-gray-500">Package</span>
                       <span className="font-medium text-purple-700">
                          {event.package_name || "Custom"}
                       </span>
                     </div>
                     <div className="flex justify-between border-t border-gray-100 pt-2">
                        <span className="text-gray-500">Location</span>
                        <div className="text-right">
                           <p className="font-medium text-gray-900">{event.venue}</p>
                           <p className="text-xs text-gray-500">{event.city}</p>
                        </div>
                     </div>
                     {event.price && (
                       <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
                         <span className="text-gray-800">Total Value</span>
                         <span className="text-green-600">
                            ₹{event.price}
                         </span>
                       </div>
                     )}
                  </div>
                  
                  {/* Notes or description if any */}
                  {event.description && (
                      <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Description</h4>
                          <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 rounded-lg p-3">
                              {event.description}
                          </p>
                      </div>
                  )}

                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No event selected
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
               {event && (
                 <div className="flex flex-col gap-3">
                   <Link 
                     to={`/manager/requests`} 
                     className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-center"
                   >
                     View All Requests
                   </Link>
                 </div>
               )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
