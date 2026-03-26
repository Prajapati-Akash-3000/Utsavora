// ─── Engagement Romantic — Soft, dreamy, romantic design ───
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
    background: "linear-gradient(170deg, #FFF7ED 0%, #FECDD3 40%, #FDA4AF 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  heartFloat: (top, left, size, opacity) => ({
    position: "absolute", top, left, fontSize: size,
    opacity, pointerEvents: "none", transform: "rotate(-15deg)",
  }),
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 600,
    letterSpacing: "0.4em", color: "#BE123C",
    textTransform: "uppercase", marginBottom: "clamp(8px, 1.5vw, 14px)",
    position: "relative", zIndex: 2,
  },
  namesWrap: {
    position: "relative", zIndex: 2,
    marginBottom: "clamp(8px, 1.2vw, 14px)",
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(24px, 4.5vw, 48px)", fontWeight: 600,
    fontStyle: "italic", color: "#881337", lineHeight: 1.2,
  },
  ampersand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(20px, 3.5vw, 36px)", fontStyle: "italic",
    color: "#E11D48", margin: "clamp(4px, 0.8vw, 10px) 0", fontWeight: 400,
  },
  emoji: {
    fontSize: "clamp(32px, 6vw, 56px)", marginBottom: "clamp(4px, 1vw, 10px)",
    position: "relative", zIndex: 2,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#9F1239",
    fontStyle: "italic", lineHeight: 1.5, maxWidth: "85%",
    margin: "0 auto clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)",
    borderRadius: "50px", border: "1px solid rgba(190,18,60,0.15)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#881337",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#9F1239",
    marginBottom: "clamp(4px, 0.5vw, 6px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#BE123C",
    marginBottom: "clamp(10px, 1.5vw, 16px)", position: "relative", zIndex: 2, opacity: 0.7,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#9F1239",
    position: "relative", zIndex: 2, opacity: 0.6,
  },
};

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

export default function EngagementRomantic({ data }) {
  const [name1, name2] = splitNames(data?.title || data?.host, data?.partner);
  const host = name1;
  const partner = name2;
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "We said YES!";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.heartFloat("8%", "12%", "28px", 0.3)} aria-hidden>💕</div>
      <div style={styles.heartFloat("15%", "78%", "22px", 0.25)} aria-hidden>❤️</div>
      <div style={styles.heartFloat("70%", "8%", "20px", 0.2)} aria-hidden>💗</div>
      <div style={styles.heartFloat("75%", "85%", "24px", 0.2)} aria-hidden>💕</div>

      <div style={styles.emoji}>💍</div>
      <span style={styles.eyebrow}>We're Engaged</span>

      <div style={styles.namesWrap}>
        <h1 style={styles.name}>{host}</h1>
        <p style={styles.ampersand}>&</p>
        <h1 style={styles.name}>{partner}</h1>
      </div>

      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <span style={styles.dateText}>{date || "Date TBD"}</span>
        {timeStr && <div style={{ fontSize: '0.85em', marginTop: '8px', fontWeight: 500, opacity: 0.9 }}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>📍 {venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>{contactNumbers}</p>}
    </div>
  );
}
