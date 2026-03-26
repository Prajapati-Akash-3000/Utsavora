import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../common/LogoutButton";
import brandIcon from "../../assets/brand/utsavora-icon.svg";

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const displayName = user?.name || user?.full_name || user?.email || user?.username || "Account";

  const avatarInitials = (user?.full_name || user?.name || user?.email || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { to: "/user/my-events", label: "My Events", icon: "event" },
    { to: "/user/bookings", label: "Bookings", icon: "receipt_long" },
    { to: "/user/profile", label: "Profile", icon: "person" },
  ];

  const managerLinks = [
    { to: "/manager/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/manager/requests", label: "Requests", icon: "inbox" },
    { to: "/manager/calendar", label: "Calendar", icon: "calendar_month" },
  ];

  const navLinks = user?.role === "MANAGER" ? managerLinks : user?.role === "USER" ? userLinks : [];

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled
        ? "bg-white/70 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] border-b border-slate-200/50"
        : "bg-white/40 backdrop-blur-md border-b border-slate-200/30"
    }`}>
      {/* Accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-opacity duration-500 ${
        scrolled ? "opacity-30" : "opacity-0"
      }`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user?.role === "MANAGER" ? "/manager/dashboard" : "/"} className="shrink-0 flex items-center gap-2 group">
          <div className="relative">
            <img src={brandIcon} alt="Utsavora" className="h-8 w-8 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
            <div className="absolute -inset-1 bg-indigo-500/15 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Utsavora
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {user && navLinks.length > 0 && (
            <div className="flex items-center rounded-full bg-slate-100/60 p-1 mr-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive(link.to)
                      ? "text-slate-900 bg-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to={user?.role === "USER" ? "/user/profile" : "/manager/profile"}
                className="group hidden sm:flex items-center gap-2.5 bg-white hover:bg-slate-50 pl-1.5 pr-4 py-1.5 rounded-full border border-slate-200/80 hover:border-slate-300 transition-all duration-200 max-w-[200px] lg:max-w-none shadow-sm hover:shadow"
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
            <div className="flex items-center gap-2">
              <Link to="/login/user" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100/60 transition-all">
                User Login
              </Link>
              <Link to="/login/manager" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100/60 transition-all">
                Manager Login
              </Link>
              <Link to="/register" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 transition-all"
          aria-label="Toggle menu"
        >
          <span className={`transition-all duration-300 ${mobileOpen ? "rotate-90 scale-90" : ""}`}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        mobileOpen ? "max-h-[500px] opacity-100 shadow-2xl" : "max-h-0 opacity-0"
      }`}>
        <div className="px-5 py-3">
          {user ? (
            <>
              <div className="space-y-0.5 py-2">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 ${
                      isActive(link.to)
                        ? "text-indigo-600 bg-indigo-50/80"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[18px] ${isActive(link.to) ? "text-indigo-500" : "text-slate-400"}`}>{link.icon}</span>
                      {link.label}
                    </span>
                    <ChevronRight size={16} className={isActive(link.to) ? "text-indigo-400" : "text-slate-300"} />
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 pb-3">
                <Link
                  to={user?.role === "USER" ? "/user/profile" : "/manager/profile"}
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-[10px] uppercase tracking-wider">{avatarInitials}</span>
                  </span>
                  {displayName}
                </Link>
                <div onClick={() => setMobileOpen(false)} className="w-full">
                  <LogoutButton className="w-full py-3" />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2.5 py-3">
              <Link to="/login/user" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-4 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors"
              >User Login <ChevronRight size={16} className="text-slate-300" /></Link>
              <Link to="/login/manager" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-4 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors"
              >Manager Login <ChevronRight size={16} className="text-slate-300" /></Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="mt-2 block w-full text-center py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
              >Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
