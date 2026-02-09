
export default function InvitationCanvas({ children, scale = 1 }) {
  return (
    <div
      className="flex justify-center items-center overflow-auto w-full h-full"
    >
      <div
        style={{
          width: "1240px",
          height: "1754px", // A5 @ 300dpi approx (Portrait)
          minWidth: "1240px",
          minHeight: "1754px",
          background: "white",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
