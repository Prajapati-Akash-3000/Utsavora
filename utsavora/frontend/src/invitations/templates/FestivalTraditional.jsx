// ─── Festival Traditional — Rich, warm Indian festival aesthetic ───
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
    background: "linear-gradient(170deg, #FFFBEB 0%, #FEF3C7 40%, #FDE68A 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  pattern: {
    position: "absolute", inset: 0, opacity: 0.05,
    backgroundImage: `radial-gradient(circle at 3px 3px, #92400E 1.5px, transparent 0)`,
    backgroundSize: "18px 18px", pointerEvents: "none",
  },
  frame: {
    position: "absolute", inset: "4%",
    border: "2px solid rgba(146, 64, 14, 0.2)",
    borderRadius: "4px", pointerEvents: "none",
  },
  frameInner: {
    position: "absolute", inset: "6%",
    border: "1px solid rgba(180, 83, 9, 0.15)",
    pointerEvents: "none",
  },
  emoji: {
    fontSize: "clamp(36px, 7vw, 64px)", marginBottom: "clamp(6px, 1vw, 12px)",
    position: "relative", zIndex: 2,
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 600,
    letterSpacing: "0.4em", color: "#92400E",
    textTransform: "uppercase", marginBottom: "clamp(8px, 1.5vw, 14px)",
    position: "relative", zIndex: 2,
  },
  accentLine: {
    width: "min(100px, 18%)", height: "2px",
    background: "linear-gradient(90deg, transparent, #B45309, transparent)",
    margin: "0 auto clamp(10px, 1.5vw, 16px)", opacity: 0.7,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(26px, 5vw, 50px)", fontWeight: 700,
    color: "#78350F", lineHeight: 1.15,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#92400E",
    lineHeight: 1.5, maxWidth: "85%",
    margin: "0 auto clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    borderTop: "1px solid rgba(146, 64, 14, 0.2)",
    borderBottom: "1px solid rgba(146, 64, 14, 0.2)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#78350F", letterSpacing: "0.08em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#92400E",
    marginBottom: "clamp(4px, 0.5vw, 6px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#B45309",
    marginBottom: "clamp(10px, 1.5vw, 16px)", position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#92400E",
    position: "relative", zIndex: 2, opacity: 0.7,
  },
};

export default function FestivalTraditional({ data }) {
  const host = data?.title || data?.host || "Festival";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Join in the festive celebrations!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.pattern} aria-hidden />
      <div style={styles.frame} aria-hidden />
      <div style={styles.frameInner} aria-hidden />

      <div style={styles.emoji}>🪔</div>
      <span style={styles.eyebrow}>Festival Celebration</span>
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
