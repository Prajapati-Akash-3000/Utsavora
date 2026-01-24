import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";

export default function ManagerCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await api.get("manager/calendar/");
      // Combine blocked and booked into a single array as expected by the grid
      const combined = [
        ...res.data.blocked.map(b => ({ ...b, type: 'BLOCKED' })),
        ...res.data.booked.map(b => ({ ...b, type: 'BOOKED' }))
      ];
      setBlocks(combined);
      setLoading(false);
    } catch (err) { // eslint-disable-line no-unused-vars
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchBlocks();
    };
    init();
  }, [fetchBlocks]);

  const handleBlockDate = async (dateStr) => {
    // Check if already blocked (using simple date comparison)
    const existing = blocks.find(b => b.date === dateStr);

    if (existing) {
      if (existing.type === 'BOOKED') {
        setMessage({ type: "error", text: "Cannot remove confirmed bookings here." });
        return;
      }
      if (!window.confirm(`Unblock ${dateStr}?`)) return;
      try {
        await api.delete(`manager/block-date/${existing.id}/`);
        setBlocks(blocks.filter(b => b.id !== existing.id));
        setMessage({ type: "success", text: "Date unblocked." });
      } catch (err) { // eslint-disable-line no-unused-vars
        setMessage({ type: "error", text: "Failed to unblock." });
      }
    } else {
      // Block it
      if (!window.confirm(`Block ${dateStr} as unavailable?`)) return;
      try {
        await api.post("manager/block-date/", {
          date: dateStr
        });
        // Refresh list to get ID
        fetchBlocks(); 
        setMessage({ type: "success", text: "Date blocked." });
      } catch (err) {
        const msg = err.response?.data?.detail || "Unable to block date. Please try again.";
        setMessage({ type: "error", text: msg });
      }
    }
  };

  const generateDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const days = [];

    // Padding for start
    for (let i = 0; i < startOfMonth.day(); i++) {
        days.push(null);
    }
    
    // Days
    for (let i = 1; i <= endOfMonth.date(); i++) {
        days.push(startOfMonth.date(i));
    }

    return days;
  };

  if (loading) return <Loader />;

  const days = generateDays();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Availability Calendar</h1>
      
      {message && <Message type={message.type} text={message.text} />}

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="p-2 hover:bg-gray-100 rounded">&lt; Prev</button>
            <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
            <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="p-2 hover:bg-gray-100 rounded">Next &gt;</button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-500">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="h-24"></div>;
                
                const dateStr = day.format("YYYY-MM-DD");
                const block = blocks.find(b => b.date === dateStr);
                
                let bgClass = "bg-white hover:bg-gray-50";
                if (block) {
                    if (block.type === 'BOOKED') {
                         bgClass = "bg-green-100 border-green-300 hover:bg-green-200";
                    } else {
                         bgClass = "bg-red-100 border-red-300 hover:bg-red-200";
                    }
                }

                return (
                    <div 
                        key={dateStr}
                        onClick={() => handleBlockDate(dateStr)}
                        className={`border rounded-lg p-2 h-24 cursor-pointer transition relative ${bgClass}`}
                    >
                        <div className="font-semibold">{day.date()}</div>
                        {block && (
                            <div className={`text-xs mt-1 font-medium ${block.type === 'BOOKED' ? 'text-green-700' : 'text-red-700'}`}>
                                {block.title || (block.type === 'BOOKED' ? 'Booked' : 'Blocked')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
      
      <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div> Blocked Date</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div> Booked Event</div>
      </div>
    </div>
  );
}
