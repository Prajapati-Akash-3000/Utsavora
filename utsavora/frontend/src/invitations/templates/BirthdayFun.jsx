import { formatDate } from "../utils/formatDate";

export default function BirthdayFun({ data }) {
  const host = data?.title || data?.host || "Someone";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Let's celebrate!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(24px, 6%, 64px) clamp(32px, 8%, 80px)",
        background: "linear-gradient(145deg, #FEF3C7 0%, #FDE68A 40%, #FCD34D 100%)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Playful circles */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "35%",
          height: "35%",
          borderRadius: "50%",
          background: "rgba(251, 146, 60, 0.35)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8%",
          right: "-5%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "rgba(236, 72, 153, 0.3)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-2%",
          width: "18%",
          height: "18%",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.25)",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(12px, 2vw, 18px)",
          fontWeight: 800,
          letterSpacing: "0.2em",
          color: "#C2410C",
          textTransform: "uppercase",
          marginBottom: "clamp(6px, 1vw, 12px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        🎉 It's a party! 🎉
      </span>

      <h1
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(26px, 5vw, 52px)",
          fontWeight: 900,
          color: "#7C2D12",
          lineHeight: 1.15,
          marginBottom: "clamp(8px, 1.5vw, 16px)",
          position: "relative",
          zIndex: 2,
          textShadow: "0 2px 4px rgba(0,0,0,0.06)",
        }}
      >
        {host}'s Birthday
      </h1>

      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(12px, 2vw, 17px)",
          color: "#92400E",
          fontWeight: 600,
          marginBottom: "clamp(16px, 2.5vw, 28px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {description}
      </p>

      <div
        style={{
          padding: "clamp(14px, 2.5vw, 22px) clamp(28px, 5vw, 48px)",
          background: "#fff",
          borderRadius: "9999px",
          boxShadow: "0 4px 14px rgba(124, 45, 18, 0.15)",
          marginBottom: "clamp(14px, 2vw, 24px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(13px, 2.2vw, 20px)",
            fontWeight: 700,
            color: "#7C2D12",
          }}
        >
          {date || "Date TBD"}
        </span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && (
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(12px, 2vw, 18px)",
            fontWeight: 600,
            color: "#78350F",
            marginBottom: "clamp(4px, 0.5vw, 8px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {venue}
        </p>
      )}
      {city && (
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(11px, 1.8vw, 15px)",
            color: "#92400E",
            marginBottom: "clamp(10px, 1.5vw, 18px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {city}
        </p>
      )}
      {contactNumbers && (
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(10px, 1.5vw, 13px)",
            color: "#A16207",
            position: "relative",
            zIndex: 2,
          }}
        >
          Contact: {contactNumbers}
        </p>
      )}
    </div>
  );
}
