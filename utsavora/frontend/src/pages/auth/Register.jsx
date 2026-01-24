import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
  });
  const [certificate, setCertificate] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", form.name); // Backend expects full_name or name
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("role", role);

      if (role === "MANAGER") {
        if (!form.company_name) throw new Error("Company Name is required");
        if (!certificate) throw new Error("Certificate is required");
        
        formData.append("company_name", form.company_name);
        formData.append("certificate", certificate);
      }

      await api.post("/auth/register/", formData);

      // store email & role for OTP screen
      localStorage.setItem("otp_email", form.email);
      localStorage.setItem("otp_role", role); 

      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        {/* Role Toggle */}
        <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name="role" 
                    checked={role === "USER"} 
                    onChange={() => setRole("USER")}
                />
                <span>Register as User</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name="role" 
                    checked={role === "MANAGER"} 
                    onChange={() => setRole("MANAGER")}
                />
                <span>Register as Manager</span>
            </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        
        <input
          type="tel"
          placeholder="Mobile Number"
          className="w-full border p-2 rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {role === "MANAGER" && (
            <div className="space-y-4 border-t pt-4 animate-fade-in">
                <p className="text-sm font-semibold text-gray-600">Manager Details</p>
                <input
                  placeholder="Company Name"
                  className="w-full border p-2 rounded"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  required
                />
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Upload Certificate</label>
                    <input
                      type="file"
                      className="w-full border p-2 rounded"
                      onChange={(e) => setCertificate(e.target.files[0])}
                      required
                    />
                </div>
            </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}
