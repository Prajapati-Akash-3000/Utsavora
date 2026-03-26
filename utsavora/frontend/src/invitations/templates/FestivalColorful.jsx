// ─── Festival Colorful — Bright, celebratory festival look ───
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
    background: "linear-gradient(145deg, #FDF2F8 0%, #FCE7F3 30%, #FBCFE8 60%, #F9A8D4 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  sparkle: (top, left, size, color) => ({
    position: "absolute", top, left, width: size, height: size,
    borderRadius: "2px", background: color, opacity: 0.4,
    transform: "rotate(45deg)", pointerEvents: "none",
  }),
  emoji: {
    fontSize: "clamp(36px, 7vw, 64px)", marginBottom: "clamp(6px, 1vw, 12px)",
    position: "relative", zIndex: 2,
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 700,
    letterSpacing: "0.4em", color: "#BE185D",
    textTransform: "uppercase", marginBottom: "clamp(8px, 1.5vw, 14px)",
    position: "relative", zIndex: 2,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(28px, 5.5vw, 54px)", fontWeight: 700,
    color: "#831843", lineHeight: 1.15,
    marginBottom: "clamp(10px, 2vw, 18px)",
    position: "relative", zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#9D174D",
    lineHeight: 1.5, maxWidth: "85%",
    margin: "0 auto clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2, opacity: 0.8,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)",
    borderRadius: "16px", border: "1px solid rgba(190,24,93,0.15)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(14px, 2.4vw, 22px)", fontWeight: 700,
    color: "#831843",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 600, color: "#9D174D",
    marginBottom: "clamp(4px, 0.5vw, 6px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#BE185D",
    marginBottom: "clamp(10px, 1.5vw, 16px)", position: "relative", zIndex: 2, opacity: 0.7,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#9D174D",
    position: "relative", zIndex: 2, opacity: 0.6,
  },
};

export default function FestivalColorful({ data }) {
  const host = data?.title || data?.host || "Festival";
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Come celebrate with us!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.sparkle("10%", "15%", "12px", "#F472B6")} aria-hidden />
      <div style={styles.sparkle("20%", "78%", "10px", "#A78BFA")} aria-hidden />
      <div style={styles.sparkle("65%", "10%", "14px", "#34D399")} aria-hidden />
      <div style={styles.sparkle("72%", "82%", "11px", "#FBBF24")} aria-hidden />
      <div style={styles.sparkle("45%", "88%", "9px", "#60A5FA")} aria-hidden />

      <div style={styles.emoji}>🎊</div>
      <span style={styles.eyebrow}>Festival</span>
      <h1 style={styles.title}>{host}</h1>
      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <span style={styles.dateText}>{date || "Date TBD"}</span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>📍 {venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>📞 {contactNumbers}</p>}
    </div>
  );
}
