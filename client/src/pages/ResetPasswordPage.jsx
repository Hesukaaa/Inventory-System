import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import api from "../lib/api";

function ResetPasswordPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    document.title = "Reset Password - Smart Inventory";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!token) {
      setError("Invalid or expired reset link.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
      toast.success("Password reset successful. You can now log in.");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-root">
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-content">
            <div className="login-logo-wrap">
              <img src="/Inventory-System/LOGO-WEBSITE.png" alt="Logo" className="login-logo-img" />
            </div>
            <div className="login-gold-line" />
            <div className="login-headline">
              Smart Inventory.<br />
              Better Operations.
            </div>
            <div className="login-desc">
              Manage inventory, maintenance, and resources efficiently and effortlessly.
            </div>
            <img src="/Inventory-System/image/invento.png" alt="Inventory" className="login-invento-img" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Reset Password</h2>
              <div className="login-sub">Invalid or expired reset link</div>
              <div className="gold-rule" />
            </div>
            <button type="button" className="btn-primary" onClick={() => window.location.href = "/"}>Back to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-bg" />
        <div className="login-left-content">
          <div className="login-logo-wrap">
            <img src="/Inventory-System/LOGO-WEBSITE.png" alt="Logo" className="login-logo-img" />
          </div>
          <div className="login-gold-line" />
          <div className="login-headline">
            Smart Inventory.<br />
            Better Operations.
          </div>
          <div className="login-desc">
            Manage inventory, maintenance, and resources efficiently and effortlessly.
          </div>
          <img src="/Inventory-System/image/invento.png" alt="Inventory" className="login-invento-img" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Reset Password</h2>
            <div className="login-sub">Enter your new password below</div>
            <div className="gold-rule" />
          </div>
          {success ? (
            <div className="forgot-success">
              <div className="forgot-success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>Password updated</h3>
              <p>Your password has been reset successfully. You can now log in with your new password.</p>
              <button type="button" className="btn-primary" onClick={() => window.location.href = "/"}>Back to Login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-password">New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className={`input-toggle${showPassword ? " active" : ""}`} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reset-confirm-password">Confirm New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="login-error" role="alert">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="btn-content">
                    <span className="btn-spinner" />
                    Resetting...
                  </span>
                ) : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
