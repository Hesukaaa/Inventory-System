import { useState, useEffect } from "react";
import { useToast } from "./Toast";
import api from "../lib/api";

function HexLogo() {
  return (
    <div className="login-logo-wrap">
      <img src="/Inventory-System/image/LOGO.png" alt="Logo" className="login-logo-img" />
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  }, [rememberMe, email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ email, password, name: email.split("@")[0] || "User" });
      toast.success("Welcome back! Login successful.");
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgot = () => {
    setForgotEmail(email);
    setShowForgot(true);
    setForgotSuccess(false);
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-bg" />
        <div className="login-left-content">
          <HexLogo />
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
          {mode === "login" && !showForgot ? (
            <>
              <div className="login-header">
                <h2>Welcome Back!</h2>
                <div className="login-sub">Sign in to continue to Image and Maintenance Department</div>
                <div className="gold-rule" />
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email or Username</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="text"
                      placeholder="Enter your email or username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                <div className="remember-forgot">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button type="button" className="forgot-link" onClick={openForgot}>Forgot password?</button>
                </div>
                {error && <div className="login-error" role="alert">{error}</div>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <span className="btn-content">
                      <span className="btn-spinner" />
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </button>
              </form>
              <div className="divider">OR</div>
              <div className="sso-buttons">
                <button type="button" className="btn-sso" onClick={() => window.location.href = "/api/auth/social/google"}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
                <button type="button" className="btn-sso" onClick={() => window.location.href = "/api/auth/social/facebook"}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Sign in with Facebook
                </button>
              </div>
              <div className="login-footer">
                <span className="login-copyright">© 2026 Image and Maintenance Department. All rights reserved.</span>
                <span className="login-footer-link">Don't have an account? <button type="button" className="text-btn" onClick={() => setMode("register")}>Sign up</button></span>
              </div>
            </>
          ) : showForgot ? (
            <>
              <div className="login-header">
                <h2>Reset Password</h2>
                <div className="login-sub">Enter your email and we'll send you a reset link</div>
                <div className="gold-rule" />
              </div>
              {forgotSuccess ? (
                <div className="forgot-success">
                  <div className="forgot-success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3>Check your email</h3>
                  <p>We've sent a password reset link to <strong>{forgotEmail}</strong>. Please check your inbox and follow the instructions.</p>
                  <button type="button" className="btn-primary" onClick={() => setShowForgot(false)}>Back to Login</button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email Address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="forgot-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>We'll send you a link to reset your password. The link will expire in 30 minutes.</span>
                  </div>
                  <button type="submit" className="btn-primary" disabled={forgotLoading}>
                    {forgotLoading ? (
                      <span className="btn-content">
                        <span className="btn-spinner" />
                        Sending...
                      </span>
                    ) : "Send Reset Link"}
                  </button>
                  <button type="button" className="back-link" onClick={() => setShowForgot(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Login
                  </button>
                </form>
              )}
            </>
          ) : (
            <RegisterForm onSwitch={setMode} onLogin={onLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await onLogin({ email, password, name });
      toast.success("Account created successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-header">
        <h2>Create Account</h2>
        <div className="login-sub">Sign up to get started with Image and Maintenance Department</div>
        <div className="gold-rule" />
      </div>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="reg-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
               <input
                 id="reg-password"
                 type={showPassword ? "text" : "password"}
                 placeholder="Create a password"
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
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
               <input
                 id="reg-confirm-password"
                 type={showConfirmPassword ? "text" : "password"}
                 placeholder="Confirm your password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
               />
               <button type="button" className={`input-toggle${showConfirmPassword ? " active" : ""}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                 {showConfirmPassword ? (
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
        {error && <div className="login-error" role="alert">{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="btn-content">
              <span className="btn-spinner" />
              Creating account...
            </span>
          ) : "Create Account"}
        </button>
      </form>
      <div className="login-footer">
        <span className="login-copyright">© 2026 Image and Maintenance Department. All rights reserved.</span>
        <span className="login-footer-link">Already have an account? <button type="button" className="text-btn" onClick={() => onSwitch("login")}>Sign in</button></span>
      </div>
    </>
  );
}

export default Login;
