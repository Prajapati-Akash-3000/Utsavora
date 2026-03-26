import { Route } from "react-router-dom";
import UserLogin from "../pages/auth/UserLogin";
import ManagerLogin from "../pages/auth/ManagerLogin";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AuthRoutes() {
  return (
    <>
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login" element={<UserLogin />} /> {/* Fallback default */}
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </>
  );
}
