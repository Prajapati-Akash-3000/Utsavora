import { motion as Motion, useReducedMotion } from "framer-motion";
import { backdrop, modal } from "../../motion/variants/modalVariants";

export default function MotionModal({ children, isOpen, onClose }) {
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  return (
    <Motion.div
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
    >
      <Motion.div
        variants={modal}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        transition={shouldReduceMotion ? { duration: 0 } : undefined}
      >
        {children}
      </Motion.div>
    </Motion.div>
  );
}
