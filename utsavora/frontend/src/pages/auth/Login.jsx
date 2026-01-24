import { useState } from "react";
import api from "../../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.token.access);
      localStorage.setItem("refresh", res.data.token.refresh);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);

      // Force reload to update AuthContext since we don't have setAuth exposed yet
      window.location.href = "/";
    } catch {
      setError("Invalid credentials or OTP not verified");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold">Login</h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>

        <div className="text-center mt-2">
            <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
}
