import { formatDate } from "../utils/formatDate";

export default function GeneralCool({ data }) {
  const title = data?.title || "Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "You're invited";
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
        background: "linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, #38BDF8, #818CF8, transparent)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, #818CF8, #38BDF8, transparent)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(10px, 1.6vw, 14px)",
          fontWeight: 700,
          letterSpacing: "0.35em",
          color: "#38BDF8",
          textTransform: "uppercase",
          marginBottom: "clamp(12px, 2vw, 20px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        Save the date
      </span>

      <h1
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(24px, 4.8vw, 48px)",
          fontWeight: 800,
          color: "#F8FAFC",
          lineHeight: 1.15,
          marginBottom: "clamp(10px, 1.8vw, 18px)",
          position: "relative",
          zIndex: 2,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(11px, 1.9vw, 16px)",
          color: "#94A3B8",
          marginBottom: "clamp(18px, 2.8vw, 30px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {description}
      </p>

      <div
        style={{
          padding: "clamp(12px, 2.2vw, 20px) clamp(24px, 4vw, 44px)",
          background: "rgba(56, 189, 248, 0.12)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          borderRadius: "8px",
          marginBottom: "clamp(16px, 2.5vw, 26px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(13px, 2.2vw, 20px)",
            fontWeight: 600,
            color: "#E2E8F0",
            letterSpacing: "0.06em",
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
            fontSize: "clamp(12px, 2vw, 17px)",
            fontWeight: 500,
            color: "#CBD5E1",
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
            color: "#94A3B8",
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
            color: "#64748B",
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
