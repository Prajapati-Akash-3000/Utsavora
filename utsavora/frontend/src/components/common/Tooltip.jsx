import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative cursor-pointer inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <Motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              bg-black text-white text-xs rounded px-2 py-1
              whitespace-nowrap z-50 shadow-lg pointer-events-none
            "
          >
            {text}
            {/* Triangle arrow */}
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
