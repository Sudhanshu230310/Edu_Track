import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { Eye, EyeOff, BookOpen, UserPlus } from "lucide-react";

export default function Signup() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch<{ token: string; user: { id: number; name: string; email: string } }>(
        "/api/auth/signup",
        { method: "POST", body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) }
      );
      login(data.token, data.user);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E4E8",
    fontSize: 14, color: "#2D3436", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s"
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
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#2D3436", margin: "12px 0 4px" }}>Create your account</h1>
          <p style={{ color: "#636E72", fontSize: 14 }}>Start learning for free — no credit card needed</p>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#2D3436", marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "#6C5CE7")}
                onBlur={e => (e.target.style.borderColor = "#E2E4E8")}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#2D3436", marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                style={inputStyle}
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
                  placeholder="At least 6 characters"
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => (e.target.style.borderColor = "#6C5CE7")}
                  onBlur={e => (e.target.style.borderColor = "#E2E4E8")}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#636E72", padding: 2 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#2D3436", marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repeat your password"
                  required
                  style={{ ...inputStyle, paddingRight: 40, borderColor: form.confirmPassword && form.confirmPassword !== form.password ? "#E17055" : "#E2E4E8" }}
                  onFocus={e => (e.target.style.borderColor = "#6C5CE7")}
                  onBlur={e => (e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password ? "#E17055" : "#E2E4E8")}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#636E72", padding: 2 }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p style={{ color: "#E17055", fontSize: 12, marginTop: 4 }}>Passwords don't match</p>
              )}
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
              <UserPlus size={16} />
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#636E72", fontSize: 14 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6C5CE7", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
