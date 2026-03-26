import { motion as Motion, useReducedMotion } from "framer-motion";
import { cardVariants } from "../../motion/variants/cardVariants";

export default function MotionCard({ children, className = "", onClick }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </Motion.div>
  );
}
