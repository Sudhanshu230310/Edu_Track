import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { Eye, EyeOff, BookOpen, LogIn } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiFetch<{ token: string; user: { id: number; name: string; email: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) }
      );
      login(data.token, data.user);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5FA", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={20} color="white" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#2D3436" }}>EduTrack</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#2D3436", margin: "12px 0 4px" }}>Welcome back</h1>
          <p style={{ color: "#636E72", fontSize: 14 }}>Sign in to continue your learning journey</p>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#2D3436", marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E4E8",
                  fontSize: 14, color: "#2D3436", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => (e.target.style.borderColor = "#6C5CE7")}
                onBlur={e => (e.target.style.borderColor = "#E2E4E8")}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#2D3436", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1.5px solid #E2E4E8",
                    fontSize: 14, color: "#2D3436", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => (e.target.style.borderColor = "#6C5CE7")}
                  onBlur={e => (e.target.style.borderColor = "#E2E4E8")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#636E72", padding: 2 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#FDE8E4", color: "#C0392B", padding: "10px 14px", borderRadius: 8, fontSize: 13, border: "1px solid #FBBDAD" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? "#A29BFE" : "#6C5CE7", color: "white", border: "none",
                borderRadius: 10, padding: "12px 0", fontSize: 15, fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s"
              }}
              onMouseEnter={e => { if (!isLoading) (e.currentTarget.style.background = "#4834D4"); }}
              onMouseLeave={e => { if (!isLoading) (e.currentTarget.style.background = "#6C5CE7"); }}
            >
              <LogIn size={16} />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#636E72", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#6C5CE7", fontWeight: 600, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
