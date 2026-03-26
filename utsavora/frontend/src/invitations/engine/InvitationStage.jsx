import { useEffect, useRef, useState } from "react";

export default function InvitationStage({ width, height, children }) {

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {

    const resize = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const scaleX = rect.width / width;

      setScale(scaleX);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);

  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-start justify-center bg-gray-100 pt-2"
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
