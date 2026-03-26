// Animations moved to CSS (animate-float-slow) — no Framer Motion needed

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-slate-50/50">
      {/* ─── Animated Mesh Gradient ─── */}
      <div 
        className="absolute inset-0 opacity-[0.6] mix-blend-multiply"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(91, 95, 255, 0.3) 0px, transparent 60%),
            radial-gradient(at 50% 0%, rgba(110, 231, 183, 0.25) 0px, transparent 55%),
            radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.2) 0px, transparent 55%),
            radial-gradient(at 0% 100%, rgba(129, 140, 248, 0.25) 0px, transparent 60%),
            radial-gradient(at 100% 100%, rgba(167, 139, 250, 0.3) 0px, transparent 55%)
          `,
          filter: 'blur(100px)',
        }}
      />

      {/* ─── Floating Blobs (CSS-animated, no JS overhead) ─── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-400/25 rounded-full blur-[120px] animate-float-slow"
        />
        <div
          className="absolute bottom-[-20%] right-[-20%] w-[65%] h-[65%] bg-emerald-400/20 rounded-full blur-[130px] animate-float-slow"
          style={{ animationDelay: '5s' }}
        />
        <div
          className="absolute top-[25%] right-[10%] w-[40%] h-[40%] bg-purple-500/25 rounded-full blur-[100px] animate-float-slow"
          style={{ animationDelay: '10s' }}
        />
      </div>

      {/* ─── Dot Pattern Overlay ─── */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(91, 95, 255, 1) 2px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ─── Grain Effect ─── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }} />
    </div>
  );
}
