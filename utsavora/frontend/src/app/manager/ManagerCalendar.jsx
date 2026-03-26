import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../services/api"; // Using api helper instead of raw axios for consistency
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Tooltip from "../../components/common/Tooltip";

export default function ManagerCalendar({ isEmbedded = false, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className={isEmbedded ? "w-full" : "max-w-4xl mx-auto p-6"}>
      {!isEmbedded && <h1 className="text-3xl font-bold mb-6">Availability Calendar</h1>}
      
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border ${
        isEmbedded ? "bg-white/55 border-white/60" : "bg-white border-gray-100 shadow-sm"
      }`}>
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="px-3 sm:px-4 py-2 border border-slate-200 rounded-xl hover:bg-white/60 transition text-sm font-semibold text-slate-700"
        >
          ← Prev
        </button>
        <h2 className="text-base sm:text-xl font-black text-slate-800">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="px-3 sm:px-4 py-2 border border-slate-200 rounded-xl hover:bg-white/60 transition text-sm font-semibold text-slate-700"
        >
          Next →
        </button>
      </div>

      <div className={`rounded-2xl p-4 sm:p-6 border ${
        isEmbedded ? "bg-white/55 border-white/60" : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-3">
            {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="bg-gray-50 rounded-lg min-h-[110px] border border-transparent"></div>;
                
                const dateStr = day.format("YYYY-MM-DD");
                const dayStatus = availability.find(b => b.date === dateStr);
                const isToday = dateStr === dayjs().format("YYYY-MM-DD");
                
                // Base structure for the day cell
                let cellClass = `border rounded-lg p-2 min-h-[110px] flex flex-col transition cursor-pointer ${
                    isToday ? "border-purple-400 bg-purple-50" : "bg-white/70 hover:bg-white/90 border-gray-200"
                }`;

                return (
                    <div key={dateStr} className="flex flex-col">
                        <Tooltip text={dayStatus?.status === "BOOKED" ? "Event booked" : dayStatus?.status === "BLOCKED" ? "Manually blocked" : "Available"}>
                            <div 
                                onClick={() => {
                                    if (dayStatus?.status === 'BOOKED') {
                                        if (onEventClick) {
                                            onEventClick({
                                                ...dayStatus,
                                                id: dayStatus.event_id,
                                                status: 'CONFIRMED'
                                            });
                                        } else if (dayStatus.event_id) {
                                            navigate(`/manager/event/${dayStatus.event_id}`);
                                        }
                                    } else {
                                        handleBlockDate(dateStr);
                                    }
                                }}
                                className={cellClass}
                            >
                                <span className={`font-semibold text-sm mb-1 ${isToday ? 'text-purple-700' : 'text-gray-700'}`}>
                                    {day.date()}
                                </span>
                                
                                {/* Event Chips */}
                                {dayStatus?.status === 'BLOCKED' && (
                                    <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded mb-1 truncate">
                                        Blocked
                                    </div>
                                )}
                                
                                {dayStatus?.status === 'BOOKED' && (
                                    <div 
                                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mb-1 truncate" 
                                        title={dayStatus.event_name || 'Booked Event'}
                                    >
                                        ● {dayStatus.event_name || "Booked"}
                                    </div>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-6 justify-center text-sm"> 
          <span className="flex items-center gap-2"> 
              <span className="w-3 h-3 bg-red-300 rounded"></span> Blocked 
          </span> 
          <span className="flex items-center gap-2"> 
              <span className="w-3 h-3 bg-green-300 rounded"></span> Booked Event 
          </span> 
      </div>
    </div>
  );
}
