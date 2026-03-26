// ─── Basic Elegant — Rich, warm basic template for any event ───
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
    background: "linear-gradient(170deg, #1C1917 0%, #292524 50%, #44403C 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  frame: {
    position: "absolute", inset: "5%",
    border: "1px solid rgba(180, 83, 9, 0.25)",
    pointerEvents: "none",
  },
  cornerTL: {
    position: "absolute", top: "5%", left: "5%",
    width: "20px", height: "20px",
    borderTop: "2px solid #B45309", borderLeft: "2px solid #B45309",
    pointerEvents: "none",
  },
  cornerBR: {
    position: "absolute", bottom: "5%", right: "5%",
    width: "20px", height: "20px",
    borderBottom: "2px solid #B45309", borderRight: "2px solid #B45309",
    pointerEvents: "none",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 13px)", fontWeight: 600,
    letterSpacing: "0.45em", color: "#D97706",
    textTransform: "uppercase", marginBottom: "clamp(10px, 1.8vw, 18px)",
    position: "relative", zIndex: 2,
  },
  accentLine: {
    width: "min(80px, 14%)", height: "1px",
    background: "linear-gradient(90deg, transparent, #B45309, transparent)",
    margin: "0 auto clamp(10px, 1.5vw, 16px)",
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(26px, 5vw, 50px)", fontWeight: 600,
    color: "#FAFAF9", lineHeight: 1.15,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#A8A29E",
    lineHeight: 1.6, maxWidth: "85%",
    margin: "0 auto clamp(20px, 3vw, 30px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    borderTop: "1px solid rgba(180, 83, 9, 0.3)",
    borderBottom: "1px solid rgba(180, 83, 9, 0.3)",
    marginBottom: "clamp(16px, 2.5vw, 26px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#FDE68A", letterSpacing: "0.1em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#D6D3D1",
    marginBottom: "clamp(4px, 0.5vw, 8px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#78716C",
    letterSpacing: "0.06em", marginBottom: "clamp(12px, 2vw, 20px)",
    position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#78716C",
    position: "relative", zIndex: 2,
  },
};

export default function BasicElegant({ data }) {
  const host = data?.title || data?.host || "Event";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "You are cordially invited";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.frame} aria-hidden />
      <div style={styles.cornerTL} aria-hidden />
      <div style={styles.cornerBR} aria-hidden />

      <span style={styles.eyebrow}>You're Invited</span>
      <div style={styles.accentLine} aria-hidden />
      <h1 style={styles.title}>{host}</h1>
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
