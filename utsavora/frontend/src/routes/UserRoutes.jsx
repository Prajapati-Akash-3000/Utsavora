import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded user pages
const UserEventDetail = React.lazy(() => import("../app/user/UserEventDetail"));
const HireManager = React.lazy(() => import("../app/user/HireManager"));
const UserBookings = React.lazy(() => import("../app/user/UserBookings"));
const CreateEvent = React.lazy(() => import("../app/user/CreateEvent"));
const ManageMyEvents = React.lazy(() => import("../app/user/ManageMyEvents"));
const UserProfile = React.lazy(() => import("../app/user/UserProfile"));
const EditUserProfile = React.lazy(() => import("../app/user/EditUserProfile"));

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
        path="/user/profile"
        element={
          <ProtectedRoute role="USER">
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile/edit"
        element={
          <ProtectedRoute role="USER">
            <EditUserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/event/:id/hire"
        element={
          <ProtectedRoute role="USER">
            <HireManager />
          </ProtectedRoute>
        }
      />
    </>
  );
}
