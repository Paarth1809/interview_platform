import React, { useState } from "react";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("logged", "true");
      localStorage.setItem("token", res.data.token);
      if (remember) localStorage.setItem("remember_email", email);
      window.location.href = "/";
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      console.error("Login error:", err?.response || err);
      setError(serverMsg || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '460px' }} role="main">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            AI
          </div>
          <div>
            <h1 className="text-2xl font-bold">Interview AI</h1>
            <p className="text-muted">Practice, evaluate and improve</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <h2 className="text-xl font-bold">Welcome back</h2>

          {error && <div className="p-4 bg-red-500/20 text-red-200 rounded" role="alert">{error}</div>}

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Email</span>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              aria-label="Email"
            />
          </label>

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Password</span>
            <div className="flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                aria-label="Password"
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ padding: '0 1rem' }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a className="text-primary hover:underline" href="/forgot">Forgot?</a>
          </div>

          <button className="btn-primary w-full mt-4" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-muted text-sm my-4">Or continue with</div>

          <div className="flex justify-center">
            <button type="button" className="btn-secondary w-full" style={{ width: '100%' }}>Continue with Google</button>
          </div>

        </form>

        <div className="text-center mt-6 text-sm text-muted">
          New here? <a href="/register" className="text-primary hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}
