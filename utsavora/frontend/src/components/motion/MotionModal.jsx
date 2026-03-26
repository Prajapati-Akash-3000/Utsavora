import { motion } from "framer-motion";
import { backdrop, modal } from "../../motion/variants/modalVariants";

export default function MotionModal({ children, className = "", onClose }) {
  return (
    <motion.div 
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto"
    >
      <motion.div 
        variants={modal}
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg p-6 bg-white rounded-xl shadow-xl ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
