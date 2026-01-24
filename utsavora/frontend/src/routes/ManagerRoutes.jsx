import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerRequests from "../pages/manager/ManagerRequests";
import ManagerProfile from "../pages/manager/ManagerProfile";
import ManagerPackages from "../pages/manager/ManagerPackages";
import ManagerCalendar from "../pages/manager/ManagerCalendar";

export default function ManagerRoutes() {
  return (
    <>
      <Route path="/manager/dashboard" element={<ProtectedRoute role="MANAGER"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/requests" element={<ProtectedRoute role="MANAGER"><ManagerRequests /></ProtectedRoute>} />
      <Route path="/manager/profile" element={<ProtectedRoute role="MANAGER"><ManagerProfile /></ProtectedRoute>} />
      <Route path="/manager/packages" element={<ProtectedRoute role="MANAGER"><ManagerPackages /></ProtectedRoute>} />
      <Route path="/manager/calendar" element={<ProtectedRoute role="MANAGER"><ManagerCalendar /></ProtectedRoute>} />
    </>
  );
}
