import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded manager pages
const ManagerDashboard = React.lazy(() => import("../app/manager/ManagerDashboard"));
const ManagerRequests = React.lazy(() => import("../app/manager/ManagerRequests"));
const ManagerProfile = React.lazy(() => import("../app/manager/ManagerProfile"));
const ManagerPackages = React.lazy(() => import("../app/manager/ManagerPackages"));
const ManagerCalendar = React.lazy(() => import("../app/manager/ManagerCalendar"));
const ManagerReviewPage = React.lazy(() => import("../app/manager/review/ManagerReviewPage"));
const BankDetails = React.lazy(() => import("../app/manager/BankDetails"));

export default function ManagerRoutes() {
  return (
    <>
      <Route path="/manager/dashboard" element={<ProtectedRoute role="MANAGER"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/requests" element={<ProtectedRoute role="MANAGER"><ManagerRequests /></ProtectedRoute>} />
      <Route path="/manager/profile" element={<ProtectedRoute role="MANAGER"><ManagerProfile /></ProtectedRoute>} />
      <Route path="/manager/bank-details" element={<ProtectedRoute role="MANAGER"><BankDetails /></ProtectedRoute>} />
      <Route path="/manager/packages" element={<ProtectedRoute role="MANAGER"><ManagerPackages /></ProtectedRoute>} />
      <Route path="/manager/calendar" element={<ProtectedRoute role="MANAGER"><ManagerCalendar /></ProtectedRoute>} />
      <Route path="/manager/review" element={<ProtectedRoute role="MANAGER"><ManagerReviewPage /></ProtectedRoute>} />
    </>
  );
}
