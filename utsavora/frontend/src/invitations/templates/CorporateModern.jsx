// ─── Corporate Modern — Clean, minimal corporate look ───
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
    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  topStripe: {
    position: "absolute", top: 0, left: 0, right: 0, height: "6px",
    background: "linear-gradient(90deg, #0EA5E9, #06B6D4, #14B8A6)",
    pointerEvents: "none",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 13px)", fontWeight: 600,
    letterSpacing: "0.4em", color: "#0EA5E9",
    textTransform: "uppercase", marginBottom: "clamp(10px, 1.8vw, 18px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(24px, 4.8vw, 46px)", fontWeight: 700,
    color: "#0F172A", lineHeight: 1.2,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  divider: {
    width: "min(80px, 14%)", height: "2px",
    background: "#0EA5E9",
    margin: "0 auto clamp(14px, 2.2vw, 22px)", opacity: 0.5,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#475569",
    lineHeight: 1.6, maxWidth: "85%",
    margin: "0 auto clamp(20px, 3vw, 30px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    background: "#F0F9FF",
    borderRadius: "12px", border: "1px solid #BAE6FD",
    marginBottom: "clamp(16px, 2.5vw, 26px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#0369A1", letterSpacing: "0.06em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#334155",
    marginBottom: "clamp(4px, 0.5vw, 8px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#64748B",
    marginBottom: "clamp(12px, 2vw, 20px)", position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#94A3B8",
    position: "relative", zIndex: 2,
  },
};

export default function CorporateModern({ data }) {
  const host = data?.title || data?.host || "Corporate Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "You are cordially invited to join us";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.topStripe} aria-hidden />

      <span style={styles.eyebrow}>Corporate Invitation</span>
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
