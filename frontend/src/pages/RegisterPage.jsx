import { useState } from "react";
import api from "../api/axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (!email || !pass) return setError("Email and password are required.");
    if (pass !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password: pass });
      window.location.href = "/login";
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      console.error("Register error:", err?.response || err);
      setError(serverMsg || err?.message || "Registration failed.");
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

        <form className="flex flex-col gap-4" onSubmit={submit}>
          <h2 className="text-xl font-bold">Create an account</h2>

          {error && <div className="p-4 bg-red-500/20 text-red-200 rounded" role="alert">{error}</div>}

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Full name</span>
            <input
              className="input-field"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Full name"
            />
          </label>

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Email</span>
            <input
              className="input-field"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              type="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Password</span>
            <input
              className="input-field"
              placeholder="Create a password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              aria-label="Password"
              type="password"
              required
            />
          </label>

          <label className="block">
            <span className="text-muted text-sm mb-1 block">Confirm password</span>
            <input
              className="input-field"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-label="Confirm password"
              type="password"
              required
            />
          </label>

          <button className="btn-primary w-full mt-4" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="text-center text-muted text-sm my-4">Or continue with</div>
          <div className="flex justify-center">
            <button type="button" className="btn-secondary w-full" style={{ width: '100%' }}>Continue with Google</button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-muted">
          Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
