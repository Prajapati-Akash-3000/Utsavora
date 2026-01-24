export default function Message({ type = "info", text }) {
  const styles = {
    success: "bg-green-50 text-green-700 border-green-300",
    error: "bg-red-50 text-red-700 border-red-300",
    info: "bg-blue-50 text-blue-700 border-blue-300",
  };

  if (!text) return null;

  return (
    <div className={`border rounded p-3 text-sm mb-4 ${styles[type]}`}>
      {text}
    </div>
  );
}
