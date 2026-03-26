import React from "react";
import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";

// Lazy-loaded admin pages
const AdminDashboard = React.lazy(() => import("../app/admin/AdminDashboard"));
const AdminEscrow = React.lazy(() => import("../app/admin/AdminEscrow"));
const AdminPayments = React.lazy(() => import("../app/admin/AdminPayments"));
const TemplateManager = React.lazy(() => import("../app/admin/TemplateManager"));

export default function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<AdminDashboard />} /> 
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="escrow" element={<AdminEscrow />} />
      <Route path="payments" element={<AdminPayments />} />
      <Route path="events" element={<div className="p-4">Events Management (Coming Soon)</div>} />
    </Route>
  );
}
