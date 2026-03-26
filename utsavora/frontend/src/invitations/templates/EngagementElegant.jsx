// ─── Engagement Elegant — Refined, premium engagement card ───
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
    background: "linear-gradient(175deg, #FAF5FF 0%, #F3E8FF 50%, #EDE9FE 100%)",
    position: "relative", overflow: "hidden", boxSizing: "border-box",
  },
  pattern: {
    position: "absolute", inset: 0, opacity: 0.03,
    backgroundImage: `radial-gradient(circle at 2px 2px, #7C3AED 1px, transparent 0)`,
    backgroundSize: "22px 22px", pointerEvents: "none",
  },
  frame: {
    position: "absolute", inset: "4%",
    border: "1px solid rgba(124, 58, 237, 0.12)",
    borderRadius: "2px", pointerEvents: "none",
  },
  frameInner: {
    position: "absolute", inset: "6%",
    border: "1px solid rgba(168, 85, 247, 0.1)",
    pointerEvents: "none",
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)", fontWeight: 600,
    letterSpacing: "0.45em", color: "#7C3AED",
    textTransform: "uppercase", marginBottom: "clamp(10px, 1.8vw, 18px)",
    position: "relative", zIndex: 2,
  },
  accentLine: {
    width: "min(100px, 18%)", height: "1px",
    background: "linear-gradient(90deg, transparent, #A78BFA, transparent)",
    margin: "0 auto clamp(10px, 1.5vw, 16px)",
  },
  namesWrap: {
    position: "relative", zIndex: 2,
    marginBottom: "clamp(8px, 1.2vw, 14px)",
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(24px, 4.5vw, 48px)", fontWeight: 600,
    color: "#581C87", lineHeight: 1.2, letterSpacing: "0.02em",
  },
  ampersand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(18px, 3vw, 32px)", fontStyle: "italic",
    color: "#7C3AED", margin: "clamp(4px, 0.8vw, 10px) 0",
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)", color: "#6B21A8",
    letterSpacing: "0.1em", textTransform: "uppercase",
    marginBottom: "clamp(18px, 2.8vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(12px, 2vw, 20px) clamp(28px, 5vw, 48px)",
    borderTop: "1px solid rgba(124, 58, 237, 0.15)",
    borderBottom: "1px solid rgba(124, 58, 237, 0.15)",
    marginBottom: "clamp(16px, 2.5vw, 28px)",
    position: "relative", zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)", fontWeight: 600,
    color: "#581C87", letterSpacing: "0.08em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)", fontWeight: 500, color: "#6B21A8",
    marginBottom: "clamp(4px, 0.5vw, 8px)", position: "relative", zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)", color: "#7C3AED",
    letterSpacing: "0.06em", marginBottom: "clamp(12px, 2vw, 20px)",
    position: "relative", zIndex: 2,
  },
  contact: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.5vw, 13px)", color: "#7C3AED",
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

export default function EngagementElegant({ data }) {
  const [name1, name2] = splitNames(data?.title || data?.host, data?.partner);
  const host = name1;
  const partner = name2;
  const venue = data?.venue || "";
  const city = data?.city || "";
  const description = data?.description?.trim() || "Invite you to celebrate";
  const contactNumbers = data?.contact_numbers?.trim() || "";
  const date = formatDate(data?.start_date, data?.end_date);
  const timeStr = data?.start_time ? `${data.start_time.slice(0,5)}${data.end_time ? ` – ${data.end_time.slice(0,5)}` : ''}` : '';

  return (
    <div style={styles.card}>
      <div style={styles.pattern} aria-hidden />
      <div style={styles.frame} aria-hidden />
      <div style={styles.frameInner} aria-hidden />

      <span style={styles.eyebrow}>Engagement Ceremony</span>
      <div style={styles.accentLine} aria-hidden />

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

      {venue && <p style={styles.venue}>{venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>Contact: {contactNumbers}</p>}
    </div>
  );
}
