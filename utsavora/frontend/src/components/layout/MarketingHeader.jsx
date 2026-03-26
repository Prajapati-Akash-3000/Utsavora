import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import brandIcon from "../../assets/brand/utsavora-icon.svg";
import LogoutButton from "../common/LogoutButton";

export default function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const headerRef = useRef(null);

  const logoHref = user?.role === "MANAGER" ? "/manager/dashboard" : "/";
  const displayName = user?.name || user?.full_name || user?.username || "My Account";

  const avatarInitials = (user?.full_name || user?.name || user?.email || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/reviews", label: "Reviews" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] border-b border-slate-200/50"
          : "bg-white/0 backdrop-blur-none border-b border-transparent"
      }`}
    >
      {/* Premium gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-opacity duration-500 ${
        scrolled ? "opacity-40" : "opacity-0"
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to={logoHref} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <img src={brandIcon} alt="Utsavora" className="h-9 w-9 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <div className="absolute -inset-1.5 bg-indigo-500/15 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <span className="text-[22px] font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Utsavora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center rounded-full bg-slate-100/60 p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                    isActive(link.to)
                      ? "text-slate-900 bg-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={user.role === "MANAGER" ? "/manager/dashboard" : "/user/my-events"}
                  className="group flex items-center gap-2.5 bg-white hover:bg-slate-50 pl-1.5 pr-4 py-1.5 rounded-full border border-slate-200/80 hover:border-slate-300 transition-all duration-200 max-w-[200px] lg:max-w-none shadow-sm hover:shadow"
                  title={displayName}
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white font-bold text-[11px] uppercase tracking-wider">{avatarInitials}</span>
                  </span>
                  <span className="truncate font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    {displayName}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <>
                <Link
                  to="/login/user"
                  className="px-5 py-2.5 rounded-full text-slate-600 font-semibold hover:text-slate-900 hover:bg-slate-100/60 transition-all duration-200 text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="group relative px-5 py-2.5 rounded-full text-white font-bold text-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-indigo-900 group-hover:from-indigo-700 group-hover:to-indigo-800 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-1.5">
                    Get Started
                    <Sparkles size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all duration-200"
            aria-label="Toggle navigation menu"
          >
            <span className={`transition-all duration-300 ${isMobileMenuOpen ? "rotate-90 scale-90" : ""}`}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/60 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen ? "max-h-[600px] opacity-100 shadow-2xl" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-3 px-5">
          <div className="space-y-0.5 py-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 px-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-indigo-600 bg-indigo-50/80"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 30}ms` : "0ms" }}
              >
                {link.label}
                <ChevronRight size={16} className={isActive(link.to) ? "text-indigo-400" : "text-slate-300"} />
              </Link>
            ))}
          </div>

          <div className="pt-3 pb-4 border-t border-slate-100 mt-2 space-y-2.5">
            {user ? (
              <>
                <Link
                  to={user.role === "MANAGER" ? "/manager/dashboard" : "/user/my-events"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-[10px] uppercase tracking-wider">{avatarInitials}</span>
                  </span>
                  {displayName}
                </Link>
                <div onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <LogoutButton className="w-full py-3" />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login/user"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block text-center px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block text-center px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
