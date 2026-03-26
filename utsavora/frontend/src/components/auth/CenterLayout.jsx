import { motion as Motion } from "framer-motion";
import AuthLayout from "./AuthLayout";

/**
 * Centered single-card layout for focused flows:
 * ForgotPassword, VerifyOtp, ResetVerifyOtp, etc.
 */
export default function CenterLayout({ children, brandingHint, maxWidth = "max-w-md" }) {
  return (
    <AuthLayout brandingHint={brandingHint}>
      <Motion.div
        className={`${maxWidth} mx-auto`}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </Motion.div>
    </AuthLayout>
  );
}
