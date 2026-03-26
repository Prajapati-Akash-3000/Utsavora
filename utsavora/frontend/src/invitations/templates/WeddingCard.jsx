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
    background: "linear-gradient(175deg, #FDF8F8 0%, #FAF2F2 40%, #F5EBEB 100%)",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  pattern: {
    position: "absolute",
    inset: 0,
    opacity: 0.035,
    backgroundImage: `radial-gradient(circle at 2px 2px, #7F1D1D 1px, transparent 0)`,
    backgroundSize: "20px 20px",
    pointerEvents: "none",
  },
  frame: {
    position: "absolute",
    inset: "4%",
    border: "1px solid rgba(127, 29, 29, 0.1)",
    borderRadius: "2px",
    pointerEvents: "none",
  },
  frameInner: {
    position: "absolute",
    inset: "6%",
    border: "1px solid rgba(180, 83, 9, 0.2)",
    borderRadius: "1px",
    pointerEvents: "none",
  },
  accentLine: {
    width: "min(100px, 18%)",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #92400E, transparent)",
    margin: "0 auto",
    opacity: 0.7,
  },
  eyebrow: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(10px, 1.6vw, 14px)",
    fontWeight: 600,
    letterSpacing: "0.4em",
    color: "#831843",
    textTransform: "uppercase",
    marginBottom: "clamp(12px, 2vw, 20px)",
    position: "relative",
    zIndex: 2,
  },
  namesWrap: {
    position: "relative",
    zIndex: 2,
    marginBottom: "clamp(8px, 1.2vw, 14px)",
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(24px, 4.5vw, 48px)",
    fontWeight: 600,
    fontStyle: "italic",
    color: "#7F1D1D",
    lineHeight: 1.2,
    letterSpacing: "0.02em",
  },
  ampersand: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(18px, 3vw, 32px)",
    fontStyle: "italic",
    color: "#9F1239",
    margin: "clamp(4px, 0.8vw, 10px) 0",
    fontWeight: 500,
  },
  description: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 16px)",
    color: "#5C5C5C",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "clamp(18px, 2.8vw, 28px)",
    position: "relative",
    zIndex: 2,
  },
  dateBlock: {
    padding: "clamp(14px, 2.4vw, 22px) clamp(28px, 5vw, 48px)",
    borderTop: "1px solid rgba(127, 29, 29, 0.18)",
    borderBottom: "1px solid rgba(127, 29, 29, 0.18)",
    marginBottom: "clamp(16px, 2.5vw, 26px)",
    position: "relative",
    zIndex: 2,
  },
  dateText: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(13px, 2.2vw, 20px)",
    fontWeight: 600,
    color: "#7F1D1D",
    letterSpacing: "0.08em",
  },
  venue: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(12px, 2vw, 17px)",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "clamp(4px, 0.5vw, 8px)",
    position: "relative",
    zIndex: 2,
  },
  city: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "clamp(11px, 1.8vw, 15px)",
    color: "#6B7280",
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

export default function WeddingCard({ data }) {
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

      <span style={styles.eyebrow}>Together with their families</span>
      <div style={styles.accentLine} aria-hidden />

      <div style={styles.namesWrap}>
        <h1 style={styles.name}>{host}</h1>
        <p style={styles.ampersand}>&</p>
        <h1 style={styles.name}>{partner}</h1>
      </div>
      <p style={styles.description}>{description}</p>

      <div style={styles.dateBlock}>
        <div style={styles.dateText}>{date || "Date TBD"}</div>
        {timeStr && <div style={{...styles.dateText, fontSize: "clamp(11px, 1.8vw, 16px)", marginTop: "8px", color: "#9F1239", fontWeight: 500}}>{timeStr}</div>}
      </div>

      {venue && <p style={styles.venue}>{venue}</p>}
      {city && <p style={styles.city}>{city}</p>}
      {contactNumbers && <p style={styles.contact}>Contact: {contactNumbers}</p>}
    </div>
  );
}
