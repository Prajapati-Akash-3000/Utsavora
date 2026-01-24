import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import UserEventDetail from "../pages/user/UserEventDetail";
import HireManager from "../pages/user/HireManager";
import UserBookings from "../pages/user/UserBookings";
import CreateEvent from "../pages/user/CreateEvent";
import ManageMyEvents from "../pages/user/ManageMyEvents";

export default function UserRoutes() {
  return (
    <>
      <Route
        path="/user/event/:id"
        element={
          <ProtectedRoute role="USER">
            <UserEventDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute role="USER">
            <UserBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/create-event"
        element={
          <ProtectedRoute role="USER">
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/my-events"
        element={
          <ProtectedRoute role="USER">
            <ManageMyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/hire/:id"
        element={
          <ProtectedRoute role="USER">
            <HireManager />
          </ProtectedRoute>
        }
      />
    </>
  );
}
