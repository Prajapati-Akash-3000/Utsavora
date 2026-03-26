import { motion, useReducedMotion } from "framer-motion";
import { pageVariants } from "../../motion/variants/pageVariants";

export default function PageWrapper({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, we disable the transition duration
  const variants = shouldReduceMotion
    ? {
        ...pageVariants,
        visible: {
          ...pageVariants.visible,
          transition: { ...pageVariants.visible.transition, duration: 0 }
        },
        exit: {
          ...pageVariants.exit,
          transition: { ...pageVariants.exit.transition, duration: 0 }
        }
      }
    : pageVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
