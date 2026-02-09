import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754;

export default function AutoFitInvitationCanvas({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate available scale
      const scaleX = width / CANVAS_WIDTH;
      const scaleY = height / CANVAS_HEIGHT;

      // Use smaller scale to fit fully, minus some padding factor if needed
      // (Using 0.95 factor to ensure it doesn't touch edges exactly, optional but nice)
      setScale(Math.min(scaleX, scaleY) * 0.95);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center overflow-hidden bg-gray-200"
    >
      <div
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          minWidth: CANVAS_WIDTH, // Force min width
          minHeight: CANVAS_HEIGHT, // Force min height
          transform: `scale(${scale})`,
          transformOrigin: "center",
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
