import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../services/api"; // Using api helper instead of raw axios for consistency
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Tooltip from "../../components/common/Tooltip";

export default function ManagerCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    try {
      // Correct endpoint based on grep results: accounts/urls.py -> manager/availability/
      const res = await api.get("/accounts/manager/availability/");
      setAvailability(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Calendar error:", err);
      // Don't crash for auth errors, just show message
      toast.error("Failed to load calendar. Please try again.");
      setAvailability([]); // Safe fallback to prevent mapping errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleBlockDate = async (dateStr) => {
    // Check if already blocked
    const existing = availability.find(b => b.date === dateStr);

    if (existing) {
      // 🛑 STOP: Cannot unblock event bookings
      if (existing.status === 'BOOKED') {
        toast.error("Booked dates cannot be unblocked. They are locked.");
        return;
      }

      if (!window.confirm(`Unblock ${dateStr}?`)) return;

      try {
        // Correct DELETE with body for axios
        await api.delete("/accounts/manager/availability/remove/", {
            data: { date: dateStr }
        });

        // Optimistic update
        setAvailability(availability.filter(b => b.date !== dateStr));
        toast.success("Date unblocked.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to unblock. " + (err.response?.data?.detail || ""));
      }
    } else {
      // Block it
      if (!window.confirm(`Block ${dateStr} as unavailable?`)) return;
      try {
        await api.post("/accounts/manager/availability/add/", {
          date: dateStr
        });
        toast.success("Date blocked successfully");
        fetchAvailability(); 
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.detail || "Failed to block date";
        toast.error(msg);
      }
    }
  };

  if (loading) {
    return <Loader text="Loading calendar..." />;
  }

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const days = [];

  // Padding
  for (let i = 0; i < startOfMonth.day(); i++) days.push(null);
  // Days
  for (let i = 1; i <= endOfMonth.date(); i++) days.push(startOfMonth.date(i));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Availability Calendar</h1>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="p-2 hover:bg-gray-100 rounded font-bold">&lt; Prev</button>
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="p-2 hover:bg-gray-100 rounded font-bold">Next &gt;</button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-500">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="h-24 bg-gray-50 rounded"></div>;
                
                const dateStr = day.format("YYYY-MM-DD");
                // Safe find
                const dayStatus = availability.find(b => b.date === dateStr);
                
                let bg = "bg-white hover:bg-gray-50 border-gray-200";
                let statusText = "";
                let textColor = "text-gray-700";

                if (dayStatus) {
                    if (dayStatus.status === "BOOKED") {
                        bg = "bg-green-100 border-green-300 hover:bg-green-200 cursor-not-allowed"; // Changed cursor to not-allowed for booked
                        statusText = "Booked";
                        textColor = "text-green-800";
                    } else if (dayStatus.status === "BLOCKED") {
                        bg = "bg-red-100 border-red-300 hover:bg-red-200 cursor-pointer";
                        statusText = "Blocked";
                        textColor = "text-red-800";
                    }
                }

                const tooltipText = dayStatus?.status === "BOOKED" 
                    ? `Booked for event` 
                    : dayStatus?.status === "BLOCKED"
                    ? "Manually blocked by you"
                    : "Available";

                return (
                    <div key={dateStr} className="h-24">
                        <Tooltip text={tooltipText}>
                            <div 
                                onClick={() => {
                                    if (dayStatus?.status === 'BOOKED' && dayStatus?.event_id) {
                                        navigate(`/manager/event/${dayStatus.event_id}`);
                                    } else {
                                        handleBlockDate(dateStr);
                                    }
                                }}
                                className={`border rounded-lg p-2 h-full transition relative flex flex-col justify-between ${bg}`}
                            >
                                <div className="font-semibold">{day.date()}</div>
                                {dayStatus && (
                                    <div className={`text-xs font-bold ${textColor}`}>
                                        {statusText}
                                        {dayStatus.status === "BOOKED" && dayStatus.event_name && (
                                            <div className="mt-1 text-xs truncate border-t border-green-300 pt-1">
                                                {dayStatus.event_name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mt-6 flex gap-6 text-sm justify-center">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div> Blocked (Manual)</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div> Booked (Event)</div>
      </div>
    </div>
  );
}
