// Parse YYYY-MM-DD as local date (no UTC shift) and format for display
function formatDate(start, end) {
  const toLocal = (s) => {
    if (!s) return null;
    const str = String(s).trim();
    const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      const [, y, m, d] = match;
      return `${Number(m)}/${Number(d)}/${y}`;
    }
    try {
      return new Date(str).toLocaleDateString();
    } catch {
      return null;
    }
  };
  const startStr = toLocal(start);
  if (!startStr) return "";
  const endStr = end ? toLocal(end) : null;
  if (!endStr || String(start).trim() === String(end).trim()) return startStr;
  return `${startStr} – ${endStr}`;
}

const styles = {
  card: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "clamp(24px, 6%, 64px) clamp(32px, 8%, 80px)",
    background: "linear-gradient(165deg, #FDFBF7 0%, #F8F4ED 50%, #F5F0E8 100%)",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  pattern: {
    position: "absolute",
    inset: 0,
    opacity: 0.04,
    backgroundImage: `radial-gradient(circle at 2px 2px, #2D1B4E 1px, transparent 0)`,
    backgroundSize: "24px 24px",
    pointerEvents: "none",
  },
  frame: {
    position: "absolute",
    inset: "4%",
    border: "1px solid rgba(45, 27, 78, 0.12)",
    borderRadius: "2px",
    pointerEvents: "none",
  },
  frameInner: {
    position: "absolute",
    inset: "6%",
    border: "1px solid rgba(184, 134, 11, 0.25)",
    borderRadius: "1px",
    pointerEvents: "none",
  },
  accentLine: {
    width: "min(120px, 20%)",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #B8860B, transparent)",
    margin: "0 auto",
    opacity: 0.8,
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)",
    fontWeight: 600,
    letterSpacing: "0.35em",
    color: "#5B4B7A",
    textTransform: "uppercase",
    marginBottom: "clamp(8px, 1.5vw, 16px)",
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(28px, 5.5vw, 56px)",
    fontWeight: 600,
    color: "#2D1B4E",
    lineHeight: 1.15,
    marginBottom: "clamp(10px, 2vw, 20px)",
    position: "relative",
    zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 18px)",
    color: "#5C5C5C",
    lineHeight: 1.5,
    maxWidth: "85%",
    margin: "0 auto clamp(20px, 3vw, 32px)",
    position: "relative",
    zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2.2vw, 20px) clamp(24px, 4vw, 44px)",
    borderTop: "1px solid rgba(45, 27, 78, 0.15)",
    borderBottom: "1px solid rgba(45, 27, 78, 0.15)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative",
    zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)",
    fontWeight: 600,
    color: "#2D1B4E",
    letterSpacing: "0.08em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 18px)",
    fontWeight: 500,
    color: "#3D3D3D",
    marginBottom: "clamp(4px, 0.5vw, 8px)",
    position: "relative",
    zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)",
    color: "#6B6B6B",
    letterSpacing: "0.06em",
    marginBottom: "clamp(12px, 2vw, 20px)",
    position: "relative",
    zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)",
    color: "#7A7A7A",
    letterSpacing: "0.04em",
    position: "relative",
    zIndex: 2,
  },
};

export default function BirthdayCard({ data }) {
  const host = data?.title || data?.host || "Someone";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Join us for a celebration!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.pattern} aria-hidden />
      <div style={styles.frame} aria-hidden />
      <div style={styles.frameInner} aria-hidden />

      <span style={styles.eyebrow}>It's a party!</span>
      <div style={styles.accentLine} aria-hidden />

      <h1 style={styles.title}>{host}'s Birthday</h1>
      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <div style={styles.dateText}>{date || "Date TBD"}</div>
        {timeStr && <div style={{...styles.dateText, fontSize: "clamp(11px, 1.8vw, 16px)", marginTop: "8px", color: "#5B4B7A", fontWeight: 500}}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>{venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>Contact: {contactNumbers}</p>}
    </div>
  );
}
