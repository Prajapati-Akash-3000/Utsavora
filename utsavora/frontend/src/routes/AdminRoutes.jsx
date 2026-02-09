import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEscrow from "../pages/admin/AdminEscrow";
import AdminPayments from "../pages/admin/AdminPayments";
import TemplateManager from "../pages/admin/TemplateManager";
// Keep existing imports if needed, but for now we focus on the new ones
// import ManagerVerification from "../pages/admin/ManagerVerification";
// import UsersList from "../pages/admin/UsersList";

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
      <Route path="templates" element={<TemplateManager />} />
      <Route path="events" element={<div className="p-4">Events Management (Coming Soon)</div>} />
    </Route>
  );
}
