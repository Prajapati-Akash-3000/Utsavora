import { formatDate } from "../utils/formatDate";

// Split "Name1 & Name2" or "Name1 and Name2" from the title into two names
function splitNames(title, partnerField) {
  const raw = title || "";
  const sep = raw.match(/\s+(&|and)\s+/i);
  if (sep) {
    const idx = sep.index;
    return [raw.slice(0, idx).trim(), raw.slice(idx + sep[0].length).trim()];
  }
  return [raw || "Partner", partnerField || "Partner"];
}

export default function WeddingClassic({ data }) {
  const [name1, name2] = splitNames(data?.title || data?.host, data?.partner);
  const host = name1;
  const partner = name2;
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Request the pleasure of your company";
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
        background: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 35%, #FDE68A 100%)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "3%",
          border: "2px solid rgba(180, 83, 9, 0.35)",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "5%",
          border: "1px solid rgba(180, 83, 9, 0.2)",
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(10px, 1.6vw, 14px)",
          fontWeight: 600,
          letterSpacing: "0.45em",
          color: "#92400E",
          textTransform: "uppercase",
          marginBottom: "clamp(14px, 2vw, 22px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        Together with their families
      </span>

      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 4.2vw, 44px)",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#78350F",
          lineHeight: 1.2,
          marginBottom: "clamp(4px, 0.6vw, 10px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {host}
      </h1>
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(16px, 2.8vw, 28px)",
          fontStyle: "italic",
          color: "#B45309",
          margin: "clamp(4px, 0.8vw, 10px) 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        &amp;
      </p>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 4.2vw, 44px)",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#78350F",
          lineHeight: 1.2,
          marginBottom: "clamp(14px, 2.2vw, 24px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {partner}
      </h1>

      <p
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "clamp(10px, 1.6vw, 14px)",
          color: "#6B7280",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "clamp(16px, 2.5vw, 26px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {description}
      </p>

      <div
        style={{
          padding: "clamp(14px, 2.4vw, 22px) clamp(32px, 5vw, 52px)",
          borderTop: "1px solid rgba(180, 83, 9, 0.3)",
          borderBottom: "1px solid rgba(180, 83, 9, 0.3)",
          marginBottom: "clamp(14px, 2.2vw, 24px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(13px, 2.2vw, 20px)",
            fontWeight: 600,
            color: "#78350F",
            letterSpacing: "0.1em",
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
            color: "#374151",
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
            color: "#6B7280",
            letterSpacing: "0.08em",
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
            color: "#9CA3AF",
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
