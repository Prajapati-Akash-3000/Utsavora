// ─── Concert Vibrant — Bold, energetic concert poster style ───
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
    background: "linear-gradient(155deg, #DC2626 0%, #B91C1C 35%, #7F1D1D 70%, #450A0A 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  diagonalStripe: {
    position: "absolute", inset: 0, opacity: 0.06,
    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)",
    pointerEvents: "none",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 700,
    letterSpacing: "0.5em", color: "#FCA5A5",
    textTransform: "uppercase", marginBottom: "clamp(8px, 1.5vw, 14px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(30px, 6vw, 58px)", fontWeight: 900,
    color: "#FFFFFF", lineHeight: 1.1,
    textTransform: "uppercase", letterSpacing: "-0.02em",
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
    textShadow: "3px 3px 0 rgba(0,0,0,0.2)",
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#FECACA",
    lineHeight: 1.5, maxWidth: "85%",
    margin: "0 auto clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2,
  },
  datePill: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)",
    borderRadius: "50px", border: "2px solid rgba(255,255,255,0.15)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(14px, 2.4vw, 22px)", fontWeight: 700,
    color: "#FFFFFF", letterSpacing: "0.1em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 600, color: "#FEE2E2",
    marginBottom: "clamp(4px, 0.5vw, 6px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#FCA5A5",
    marginBottom: "clamp(10px, 1.5vw, 16px)", position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#FCA5A5",
    position: "relative", zIndex: 2,
  },
};

export default function ConcertVibrant({ data }) {
  const host = data?.title || data?.host || "Live Concert";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "An electrifying night awaits!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.diagonalStripe} aria-hidden />

      <span style={styles.eyebrow}>🎸 Live Event</span>
      <h1 style={styles.title}>{host}</h1>
      <p style={styles.description}>{description}</p>

      <div style={styles.datePill}>
        <span style={styles.dateText}>{date || "Date TBD"}</span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>📍 {venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>{contactNumbers}</p>}
    </div>
  );
}
