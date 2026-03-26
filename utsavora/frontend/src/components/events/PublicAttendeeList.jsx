import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";

export default function PublicAttendeeList({ eventId }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true); // Removed to prevent cascading render. Handled by key-remount.
    api.get(`/events/public/${eventId}/attendees/`)
      .then((res) => {
          setAttendees(res.data);
      })
      .catch((err) => {
          console.error(err);
          // 403 means auth failed (not owner), effectively hide or show error
          if (err.response?.status !== 403) {
             toast.error(handleApiError(err));
          }
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
      return <div className="p-4 text-center text-gray-500">Loading attendees...</div>;
  }

  if (attendees.length === 0) {
      return (
          <div className="p-8 text-center bg-gray-50 rounded border border-dashed text-gray-500">
              No confirmed attendees yet.
          </div>
      );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Mobile</th>
            <th className="p-3 border-b">Registered On</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {attendees.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50 border-b last:border-0">
              <td className="p-3">{a.full_name}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{a.mobile}</td>
              <td className="p-3">{new Date(a.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right text-xs text-gray-400">
          Total Attendees: {attendees.length}
      </div>
    </div>
  );
}
