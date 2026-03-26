import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import { handleApiError } from "../../utils/handleApiError";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^\+?[0-9]{10,15}$/;
const PASSWORD_MIN = 8;

function validateForm(form, role, certificate) {
  const errors = {};
  const name = (form.name || "").trim();
  if (!name) errors.full_name = ["Full name is required."];
  else if (name.length < 2) errors.full_name = ["Full name must be at least 2 characters."];
  else if (name.length > 255) errors.full_name = ["Full name must be at most 255 characters."];
  const email = (form.email || "").trim().toLowerCase();
  if (!email) errors.email = ["Email is required."];
  else if (!EMAIL_REGEX.test(email)) errors.email = ["Enter a valid email address."];
  const password = (form.password || "").trim();
  if (!password) errors.password = ["Password is required."];
  else {
    const pwErrors = [];
    if (password.length < PASSWORD_MIN) pwErrors.push(`Password must be at least ${PASSWORD_MIN} characters.`);
    if (!/[A-Za-z]/.test(password)) pwErrors.push("Password must contain at least one letter.");
    if (!/[0-9]/.test(password)) pwErrors.push("Password must contain at least one digit.");
    if (pwErrors.length) errors.password = pwErrors;
  }
  const phone = (form.phone || "").trim().replace(/\s/g, "");
  if (phone && !MOBILE_REGEX.test(phone)) errors.mobile = ["Enter a valid mobile number (10–15 digits, optional +)."];
  if (role === "MANAGER") {
    if (!(form.company_name || "").trim()) errors.company_name = ["Company name is required for managers."];
    if (!certificate) errors.certificate = ["Certificate file is required for managers."];
    else {
      const n = (certificate.name || "").toLowerCase();
      const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
      if (!allowed.some((ext) => n.endsWith(ext))) errors.certificate = ["Allowed formats: .pdf, .jpg, .jpeg, .png"];
      else if (certificate.size > 5 * 1024 * 1024) errors.certificate = ["File must be under 5 MB."];
    }
  }
  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", company_name: "" });
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setFieldErrors({}); setShake(false);
    const clientErrors = validateForm(form, role, certificate);
    if (Object.keys(clientErrors).length > 0) { setFieldErrors(clientErrors); setShake(true); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", form.name.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("password", form.password);
      formData.append("phone", form.phone.trim());
      formData.append("mobile", form.phone.trim());
      formData.append("role", role);
      if (role === "MANAGER") {
        formData.append("company_name", form.company_name.trim());
        formData.append("certificate", certificate);
      }
      await api.post("/auth/register/", formData);
      localStorage.setItem("otp_email", form.email.trim().toLowerCase());
      localStorage.setItem("otp_role", role);
      navigate("/verify-otp");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === "object") setFieldErrors(data.errors);
      else setError(handleApiError(err));
      setShake(true);
    } finally { setLoading(false); }
  };

  const showFieldError = (field) => {
    const list = fieldErrors[field];
    if (!list?.length) return null;
    return <p className="text-red-600 text-sm mt-1 font-semibold">{list[0]}</p>;
  };

  const inputClass = (field) =>
    `w-full bg-white border rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-400 font-semibold ${
      fieldErrors[field]
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
        : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
    }`;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Utsavora and start planning with confidence."
      sideTitle="Start Your Journey."
      sideSubtitle="Join thousands of users who trust Utsavora for seamless event planning."
      sideFeatures={[
        { icon: "rocket_launch", label: "Quick 2-minute setup" },
        { icon: "shield", label: "Secure & verified accounts" },
        { icon: "palette", label: "Beautiful event tools" },
        { icon: "bolt", label: "Lightning-fast experience" },
      ]}
      footer={
        <div className="flex items-center justify-between text-sm font-semibold">
          <Link to="/login/user" className="text-slate-600 hover:text-slate-900 transition-colors">
            Already have an account? <span className="text-indigo-600">Sign in</span>
          </Link>
        </div>
      }
    >
      <Motion.form
        onSubmit={submit}
        animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.15 }}
        onAnimationComplete={() => setShake(false)}
        className="space-y-4"
      >
        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3">
          {["USER", "MANAGER"].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                role === r
                  ? "border-slate-900 bg-slate-900 text-white shadow-md"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
              }`}
            >
              <div className="font-black">{r === "USER" ? "User" : "Manager"}</div>
              <div className={`text-xs font-semibold ${role === r ? "text-white/80" : "text-slate-500"}`}>
                {r === "USER" ? "Create & manage events" : "Get bookings & earn"}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </Motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full name</label>
            <input placeholder="Your name" className={inputClass("full_name")} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
            {showFieldError("full_name")}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mobile (optional)</label>
            <input type="tel" placeholder="+91 9876543210" className={inputClass("mobile")} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            {showFieldError("mobile")}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email</label>
          <input type="email" placeholder="you@example.com" className={inputClass("email")} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          {showFieldError("email")}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Password</label>
          <input type="password" placeholder="Min 8 chars, letter + number" className={inputClass("password")} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
          {showFieldError("password")}
        </div>

        {role === "MANAGER" && (
          <Motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <div className="font-black text-slate-900">Manager verification</div>
                  <div className="text-sm text-slate-600 font-medium leading-relaxed">Upload a certificate so we can verify your profile.</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Company name</label>
              <input placeholder="Your company / brand" className={inputClass("company_name")} value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
              {showFieldError("company_name")}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Certificate (PDF/JPG/PNG, ≤ 5 MB)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                className={`w-full bg-white border rounded-2xl px-4 py-3.5 outline-none transition-all file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer ${
                  fieldErrors.certificate ? "border-red-300" : "border-slate-200"
                }`}
                onChange={(e) => setCertificate(e.target.files[0])} required />
              {showFieldError("certificate")}
            </div>
          </Motion.div>
        )}

        {loading && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <Motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "linear" }} className="h-full bg-slate-900" />
          </div>
        )}

        <button disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-slate-900/25 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create account"}
        </button>
      </Motion.form>
    </AuthShell>
  );
}
