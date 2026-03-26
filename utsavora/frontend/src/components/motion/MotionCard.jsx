import { motion as Motion, useReducedMotion } from "framer-motion";
import { cardVariants } from "../../motion/variants/cardVariants";

export default function MotionCard({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className={className}
    >
      {children}
    </Motion.div>
  );
}
