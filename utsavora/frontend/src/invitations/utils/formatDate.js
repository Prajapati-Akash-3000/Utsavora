// Parse YYYY-MM-DD as local date (no UTC shift) and format for display
export function formatDate(start, end) {
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
