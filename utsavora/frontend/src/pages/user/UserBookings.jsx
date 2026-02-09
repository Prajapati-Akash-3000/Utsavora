import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/list/")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load bookings");
      })
      .finally(() => setLoading(false));
  }, []);

  const startPayment = async (bookingId) => {
    try {
      // 1. Create Order
      const res = await api.post("/payments/create-order/", { booking_id: bookingId });
      
      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "Utsavora",
        description: "Event Booking Payment",
        order_id: res.data.order_id,
        handler: async (response) => {
          try {
             // 2. Verify Payment
             await api.post("/payments/verify/", response);
             toast.success("Payment successful!");
             // Refresh bookings to update status
             const refreshRes = await api.get("/bookings/list/");
             setBookings(refreshRes.data);
          } catch (verifyErr) {
             console.error(verifyErr);
             toast.error("Payment verification failed");
          }
        },
        theme: { color: "#6D28D9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    }
  };

  if (loading) return <Loader text="Loading your bookings..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState message="You haven't booked any events yet." />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded shadow border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{booking.event_title}</h3>
                <p className="text-gray-600 text-sm">Manager: {booking.manager_email}</p>
                <div className="text-sm text-gray-500 mt-1">
                  Booked on: {new Date(booking.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : booking.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>
                
                {booking.status === "ACCEPTED" && booking.payment_status !== "PAID" && (
                    <button 
                      onClick={() => startPayment(booking.id)}
                      className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        Pay Now
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
