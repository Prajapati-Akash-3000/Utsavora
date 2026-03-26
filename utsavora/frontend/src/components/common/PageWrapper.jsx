import { motion as Motion, useReducedMotion } from "framer-motion";
import { pageVariants } from "../../motion/variants/pageVariants";

export default function PageWrapper({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className={className}
    >
      {children}
    </Motion.div>
  );
}
