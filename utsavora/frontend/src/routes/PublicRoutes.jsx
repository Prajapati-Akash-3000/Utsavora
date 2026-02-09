import { Route } from "react-router-dom";
import PublicEventDetail from "../pages/public/PublicEventDetail"; // Keeping for legacy if needed, or replace usage
import PublicEventList from "../pages/public/PublicEventList";
import PublicEventRegistration from "../pages/public/PublicEventRegistration";
import Home from "../pages/public/Home";
// import Login from "../pages/auth/Login"; // Deprecated
import UserLogin from "../pages/auth/UserLogin";
import ManagerLogin from "../pages/auth/ManagerLogin";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetVerifyOtp from "../pages/auth/ResetVerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import PublicEventLanding from "../pages/public/PublicEventLanding";
import PublicEventRegister from "../pages/public/PublicEventRegister";
import PublicSearchResults from "../pages/public/PublicSearchResults";

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/public/events" element={<PublicEventList />} />
      <Route path="/public/search" element={<PublicSearchResults />} />
      <Route path="/public/events/:eventId" element={<PublicEventLanding />} />
      <Route path="/public/events/:eventId/register" element={<PublicEventRegister />} />
      {/* <Route path="/public/event/:id" element={<PublicEventRegistration />} /> Deprecated */}
      <Route path="/event/:id" element={<PublicEventDetail />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login" element={<UserLogin />} /> {/* Fallback default */}
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Deprecated/Old routes */}
      {/* <Route path="/reset-verify" element={<ResetVerifyOtp />} /> */}
      {/* <Route path="/auth/reset-password" element={<ResetPassword />} /> */}
    </>
  );
}
