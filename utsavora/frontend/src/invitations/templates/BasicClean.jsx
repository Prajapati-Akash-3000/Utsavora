// ─── Basic Clean — Generic, versatile template for any event ───
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
    background: "linear-gradient(175deg, #FFFFFF 0%, #F8FAFC 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  border: {
    position: "absolute", inset: "4%",
    border: "1px solid #E2E8F0",
    pointerEvents: "none",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 13px)", fontWeight: 600,
    letterSpacing: "0.35em", color: "#64748B",
    textTransform: "uppercase", marginBottom: "clamp(10px, 1.8vw, 18px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 700,
    color: "#0F172A", lineHeight: 1.2,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  divider: {
    width: "min(60px, 12%)", height: "2px",
    background: "#CBD5E1", margin: "0 auto clamp(14px, 2.2vw, 22px)",
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#64748B",
    lineHeight: 1.6, maxWidth: "85%",
    margin: "0 auto clamp(20px, 3vw, 30px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 18px) clamp(28px, 5vw, 44px)",
    borderTop: "1px solid #E2E8F0",
    borderBottom: "1px solid #E2E8F0",
    marginBottom: "clamp(16px, 2.5vw, 26px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#1E293B", letterSpacing: "0.06em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#334155",
    marginBottom: "clamp(4px, 0.5vw, 8px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#94A3B8",
    marginBottom: "clamp(12px, 2vw, 20px)", position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#94A3B8",
    position: "relative", zIndex: 2,
  },
};

export default function BasicClean({ data }) {
  const host = data?.title || data?.host || "Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "You are invited to join us";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.border} aria-hidden />

      <span style={styles.eyebrow}>Invitation</span>
      <h1 style={styles.title}>{host}</h1>
      <div style={styles.divider} aria-hidden />
      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <span style={styles.dateText}>{date || "Date TBD"}</span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>{venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>Contact: {contactNumbers}</p>}
    </div>
  );
}
