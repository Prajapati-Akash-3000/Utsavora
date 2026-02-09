import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import ManagerRoutes from "./ManagerRoutes";
import AdminRoutes from "./AdminRoutes";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  // Using function invocation {} because these components return Fragments of <Route>
  // and <Routes> in v6 only accepts <Route> or <Fragment> as direct children.
  return (
    <Routes>
      {PublicRoutes()}
      {UserRoutes()}
      {ManagerRoutes()}
      {AdminRoutes()}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
