import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MarketingRoutes from "./MarketingRoutes";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import ManagerRoutes from "./ManagerRoutes";
import AdminRoutes from "./AdminRoutes";

import MarketingLayout from "../components/layout/MarketingLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AppLayout from "../components/layout/AppLayout";

import NotFound from "../pages/NotFound";
import Loader from "../components/common/Loader";

export default function AppRoutes() {
  const location = useLocation();
  
  // Using function invocation {} because these components return Fragments of <Route>
  // and <Routes> in v6 only accepts <Route> or <Fragment> as direct children.
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader />}>
        <Routes location={location} key={location.pathname}>
          
          <Route element={<MarketingLayout />}>
            {MarketingRoutes()}
          </Route>

          <Route element={<AuthLayout />}>
            {AuthRoutes()}
          </Route>

          <Route element={<AppLayout />}>
            {UserRoutes()}
            {ManagerRoutes()}
            {AdminRoutes()}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

