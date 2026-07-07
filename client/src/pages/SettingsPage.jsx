import { useState } from "react";

export default function SettingsPage() {
  const [s, setS] = useState({
    siteName: "iMAGE & MAINTENANCE DEPARTMENT",
    currency: "PHP",
    dateFormat: "MM/DD/YYYY",
    emailNotif: true,
    lowStockAlert: true,
    autoBackup: false,
    twoFactor: false,
    sessionTimeout: "30",
  });

  const toggle = (k) => setS((prev) => ({ ...prev, [k]: !prev[k] }));
  const update = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Settings</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Settings</div>
        </div>
        <div className="page-header-actions">
          <button className="primary" onClick={() => alert("Settings saved")}>Save Settings</button>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 16 }}>
        <div className="settings-section">
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#0f172a" }}>General</h3>
          <div className="form-group">
            <label>System Name</label>
            <input value={s.siteName} onChange={(e) => update("siteName", e.target.value)} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Currency</label>
              <select value={s.currency} onChange={(e) => update("currency", e.target.value)}>
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select value={s.dateFormat} onChange={(e) => update("dateFormat", e.target.value)}>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#0f172a" }}>Notifications</h3>
          <div className="settings-row">
            <div>
              <div className="settings-label">Email Notifications</div>
              <div className="settings-desc">Receive email alerts for important activities</div>
            </div>
            <button className={`toggle ${s.emailNotif ? "on" : ""}`} onClick={() => toggle("emailNotif")} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Low Stock Alerts</div>
              <div className="settings-desc">Get notified when items run low</div>
            </div>
            <button className={`toggle ${s.lowStockAlert ? "on" : ""}`} onClick={() => toggle("lowStockAlert")} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Auto Backup</div>
              <div className="settings-desc">Automatically backup data daily</div>
            </div>
            <button className={`toggle ${s.autoBackup ? "on" : ""}`} onClick={() => toggle("autoBackup")} />
          </div>
        </div>

        <div className="settings-section">
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#0f172a" }}>Security</h3>
          <div className="settings-row">
            <div>
              <div className="settings-label">Two-Factor Authentication</div>
              <div className="settings-desc">Add extra security to your account</div>
            </div>
            <button className={`toggle ${s.twoFactor ? "on" : ""}`} onClick={() => toggle("twoFactor")} />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Session Timeout</div>
              <div className="settings-desc">Auto-logout after inactivity (minutes)</div>
            </div>
            <select style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 13 }} value={s.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)}>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#0f172a" }}>Danger Zone</h3>
          <div className="settings-row">
            <div>
              <div className="settings-label" style={{ color: "#ef4444" }}>Clear All Data</div>
              <div className="settings-desc">Permanently delete all inventory and transaction data</div>
            </div>
            <button className="danger" onClick={() => { if (confirm("This cannot be undone. Continue?")) alert("Cleared"); }}>Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
