export default function Section({ children, className = "" }) {
  return (
    <section className={`py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </section>
  );
}
