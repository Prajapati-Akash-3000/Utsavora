// ─── Social Minimal — Clean, elegant social event ───
function formatDate(start, end) {
  const toLocal = (s) => {
    if (!s) return null;
    const str = String(s).trim();
    const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) { const [, y, m, d] = match; return `${Number(m)}/${Number(d)}/${y}`; }
    try { return new Date(str).toLocaleDateString(); } catch { return null; }
  };
  const startStr = toLocal(start);
  if (!startStr) return "";
  const endStr = end ? toLocal(end) : null;
  if (!endStr || String(start).trim() === String(end).trim()) return startStr;
  return `${startStr} – ${endStr}`;
}

const styles = {
  card: {
    width: "100%", height: "100%",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center",
    padding: "clamp(24px, 6%, 64px) clamp(32px, 8%, 80px)",
    background: "linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  frame: {
    position: "absolute", inset: "5%",
    border: "1px solid rgba(0,0,0,0.06)",
    pointerEvents: "none",
  },
  topAccent: {
    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
    width: "min(80px, 15%)", height: "3px",
    background: "#6366F1", borderRadius: "0 0 3px 3px",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 13px)", fontWeight: 600,
    letterSpacing: "0.4em", color: "#6366F1",
    textTransform: "uppercase", marginBottom: "clamp(10px, 1.8vw, 16px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(24px, 4.8vw, 46px)", fontWeight: 700,
    color: "#111827", lineHeight: 1.2,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  divider: {
    width: "min(50px, 10%)", height: "2px",
    background: "#D1D5DB", margin: "0 auto clamp(12px, 2vw, 20px)",
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#6B7280",
    lineHeight: 1.6, maxWidth: "85%",
    margin: "0 auto clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 18px) clamp(28px, 5vw, 44px)",
    background: "#FFFFFF", borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "clamp(16px, 2.5vw, 26px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#111827", letterSpacing: "0.04em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#374151",
    marginBottom: "clamp(4px, 0.5vw, 6px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#9CA3AF",
    marginBottom: "clamp(10px, 1.5vw, 16px)", position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#9CA3AF",
    position: "relative", zIndex: 2,
  },
};

export default function SocialMinimal({ data }) {
  const host = data?.title || data?.host || "Social Gathering";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "We would love for you to join us";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.frame} aria-hidden />
      <div style={styles.topAccent} aria-hidden />

      <span style={styles.eyebrow}>Social Gathering</span>
      <h1 style={styles.title}>{host}</h1>
      <div style={styles.divider} aria-hidden />
      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <span style={styles.dateText}>{date || "Date TBD"}</span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>{venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>{contactNumbers}</p>}
    </div>
  );
}
