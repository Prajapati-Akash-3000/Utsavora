import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import BookingStatusBanner from "../../components/booking/BookingStatusBanner";
import PayAdvanceButton from "../../components/payment/PayAdvanceButton";
import PayFinalButton from "../../components/payment/PayFinalButton";
import CompletedEventPanel from "../../components/booking/CompletedEventPanel";

export default function UserEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Event Details (which includes the active booking)
    api.get(`/events/${id}/`)
      .then(res => {
        setEvent(res.data);
        if (res.data.booking) {
            setBooking(res.data.booking);
        }
        setLoading(false);
      })
      .catch(err => {
          console.error("Error fetching event:", err);
          setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading event details...</div>;
  if (!event) return <div className="p-10 text-center text-red-500">Event not found</div>;

  const eventEnded = new Date() > new Date(event.end_datetime);

  return (
    <div className="p-6 space-y-6">
      {booking && <BookingStatusBanner booking={booking} />}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-600">
            <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{new Date(event.start_datetime).toLocaleDateString()}</p>
            </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                    event.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {event.status}
                </span>
            </div>
            <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{event.description}</p>
            </div>
        </div>
      </div>

      {/* Advance Payment */}
      {booking && booking.status === "PENDING_PAYMENT" && (
        <PayAdvanceButton bookingId={booking.id} />
      )}

      {/* Final Payment */}
      {booking && booking.status === "CONFIRMED" && eventEnded && (
        <PayFinalButton bookingId={booking.id} />
      )}

      {/* Completed Event Panel */}
      {booking && booking.status === "COMPLETED" && (
        <CompletedEventPanel />
      )}
    </div>
  );
}


