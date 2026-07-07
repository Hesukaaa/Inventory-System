import { useState } from "react";

function HexLogo() {
  return (
    <div className="logo-mark">
      <img src="/image/LOGO.png" alt="Logo" className="logo-img" />
    </div>
  );
}

function LoginIcon({ name }) {
  const icons = {
    person: (
      <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    lock: (
      <svg className="icon-lock" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    eye: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    google: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    facebook: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

function RegisterForm({ onSwitch }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fullname, email, password }) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Registration failed");
      }
      const data = await res.json();
      if (!data.user) throw new Error(data.message || "Registration failed");
      onSwitch("login");
      onLogin({ email: data.user.email, name: data.user.name, token: data.token });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Create Account</h2>
      <div className="login-sub">Join the Image and Maintenance Department</div>
      <div className="gold-rule" />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <div className="input-wrap">
            <span className="icon"><LoginIcon name="person" /></span>
            <input
              id="reg-name"
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <div className="input-wrap">
            <span className="icon"><LoginIcon name="person" /></span>
            <input
              id="reg-email"
              type="text"
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
            <span className="icon-lock"><LoginIcon name="lock" /></span>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <div className="input-wrap">
            <span className="icon-lock"><LoginIcon name="lock" /></span>
            <input
              id="reg-confirm"
              type="password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <div style={{ color: "#dc2626", marginBottom: 10, fontSize: 13 }}>{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <div className="divider">OR</div>
      <button type="button" className="btn-sso" onClick={() => window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=openid email profile"}>
        <LoginIcon name="google" />
        Sign up with Google
      </button>
      <button type="button" className="btn-sso" onClick={() => window.location.href = "https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email"}>
        <LoginIcon name="facebook" />
        Sign up with Facebook
      </button>
      <div className="login-footer">
        Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); onSwitch("login"); }} className="brand">Sign in</a>
      </div>
    </>
  );
}

export default function App({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ email, password, name: email.split("@")[0] || "User" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left-bg" />
        <div className="login-invento" />
        <div className="login-left-content">
          <HexLogo />
        </div>
        <div className="login-left-bottom" style={{ display: 'none' }}>
          <img className="login-bottom-img" src="/image/invento.png" alt="Warehouse" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          {mode === "login" ? (
            <>
              <h2>Welcome Back!</h2>
              <div className="login-sub">Sign in to continue to Image and Maintenance Department</div>
              <div className="gold-rule" />
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email or Username</label>
                  <div className="input-wrap">
                    <span className="icon"><LoginIcon name="person" /></span>
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
                    <span className="icon-lock"><LoginIcon name="lock" /></span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="toggle" onClick={() => setShowPassword((v) => !v)}>
                      <LoginIcon name="eye" />
                    </button>
                  </div>
                </div>
                <div className="remember-forgot">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a href="#forgot">Forgot password?</a>
                </div>
                {error && <div style={{ color: "#dc2626", marginBottom: 10, fontSize: 13 }}>{error}</div>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              <div className="divider">OR</div>
              <button type="button" className="btn-sso" onClick={() => window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=openid email profile"}>
                <LoginIcon name="google" />
                Sign in with Google
              </button>
              <button type="button" className="btn-sso" onClick={() => window.location.href = "https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email"}>
                <LoginIcon name="facebook" />
                Sign in with Facebook
              </button>
              <div className="login-footer">
                Don&apos;t have an account? <a href="#register" onClick={(e) => { e.preventDefault(); setMode("register"); }} className="brand">Create account</a>
              </div>
            </>
          ) : (
            <RegisterForm onSwitch={setMode} />
          )}
        </div>
      </div>
    </div>
  );
}
