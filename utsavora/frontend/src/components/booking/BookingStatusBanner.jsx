import CountdownTimer from "./CountdownTimer";

export default function BookingStatusBanner({ booking }) {
  switch (booking.status) {
    case "REQUESTED":
      return (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-blue-800">
          <p className="font-semibold">Waiting for Manager</p>
          <p className="text-sm">Your request has been sent. Waiting for approval.</p>
        </div>
      );

    case "PENDING_PAYMENT":
      return (
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-amber-800">Payment Pending</p>
            <p className="text-sm text-amber-700">Please pay 50% advance to confirm booking</p>
          </div>
          <CountdownTimer expiresAt={booking.expires_at} />
        </div>
      );

    case "CONFIRMED":
      return (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex justify-between items-center text-green-800">
          <div>
            <p className="font-semibold">Event Scheduled</p>
            <p className="text-sm">You're all set!</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
            Download Invite
          </button>
        </div>
      );

    case "EXPIRED":
      return (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex justify-between items-center text-red-800">
          <div>
            <p className="font-semibold">Request Expired</p>
            <p className="text-sm">You did not complete the payment in time.</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
            Retry Booking
          </button>
        </div>
      );

    case "COMPLETED":
      return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-800">
          <p className="font-semibold">Event Completed</p>
          <a href="/history" className="text-sm text-indigo-600 hover:underline">
            View History
          </a>
        </div>
      );

    default:
      return null;
  }
}
