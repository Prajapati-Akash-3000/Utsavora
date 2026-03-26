// ─── Corporate Premium — Sleek dark professional design ───
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
    background: "linear-gradient(170deg, #0F172A 0%, #1E293B 45%, #334155 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  gridOverlay: {
    position: "absolute", inset: 0, opacity: 0.04,
    backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
    backgroundSize: "40px 40px", pointerEvents: "none",
  },
  accentBar: {
    width: "min(60px, 10%)", height: "3px",
    background: "linear-gradient(90deg, #3B82F6, #6366F1)",
    margin: "0 auto clamp(12px, 2vw, 20px)",
    borderRadius: "2px",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 600,
    letterSpacing: "0.45em", color: "#94A3B8",
    textTransform: "uppercase", marginBottom: "clamp(6px, 1vw, 12px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(26px, 5vw, 50px)", fontWeight: 700,
    color: "#F1F5F9", lineHeight: 1.15,
    marginBottom: "clamp(10px, 2vw, 20px)",
    position: "relative", zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#94A3B8",
    lineHeight: 1.6, maxWidth: "85%",
    margin: "0 auto clamp(20px, 3vw, 32px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "8px",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
    background: "rgba(99, 102, 241, 0.08)",
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#A5B4FC", letterSpacing: "0.1em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#CBD5E1",
    marginBottom: "clamp(4px, 0.5vw, 8px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#64748B",
    letterSpacing: "0.06em", marginBottom: "clamp(12px, 2vw, 20px)",
    position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#64748B",
    position: "relative", zIndex: 2,
  },
};

export default function CorporatePremium({ data }) {
  const host = data?.title || data?.host || "Corporate Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "You are cordially invited";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.gridOverlay} aria-hidden />

      <span style={styles.eyebrow}>Business Event</span>
      <div style={styles.accentBar} aria-hidden />
      <h1 style={styles.title}>{host}</h1>
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
