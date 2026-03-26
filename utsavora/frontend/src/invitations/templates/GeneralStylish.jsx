import { formatDate } from "../utils/formatDate";

export default function GeneralStylish({ data }) {
  const title = data?.title || "Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "We would love to see you there";
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
        padding: "clamp(28px, 7%, 72px) clamp(36px, 9%, 88px)",
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(80px, 18%)",
          height: "2px",
          background: "#171717",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(26px, 5.2vw, 52px)",
          fontWeight: 600,
          color: "#171717",
          lineHeight: 1.2,
          marginBottom: "clamp(12px, 2vw, 22px)",
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
          fontSize: "clamp(11px, 1.8vw, 15px)",
          color: "#525252",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "clamp(20px, 3vw, 32px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {description}
      </p>

      <div
        style={{
          padding: "clamp(14px, 2.4vw, 22px) clamp(28px, 5vw, 48px)",
          borderTop: "1px solid #D4D4D4",
          borderBottom: "1px solid #D4D4D4",
          marginBottom: "clamp(18px, 2.8vw, 28px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(13px, 2.2vw, 20px)",
            fontWeight: 600,
            color: "#262626",
            letterSpacing: "0.12em",
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
            color: "#404040",
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
            color: "#737373",
            letterSpacing: "0.08em",
            marginBottom: "clamp(12px, 2vw, 20px)",
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
            color: "#A3A3A3",
            letterSpacing: "0.04em",
            position: "relative",
            zIndex: 2,
          }}
        >
          Contact: {contactNumbers}
        </p>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(80px, 18%)",
          height: "2px",
          background: "#171717",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
