import React from "react";

export default function PlaceholderPage({ title }) {
  return (
    <div className="page-container page-enter">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="card hover-lift" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="empty-state" style={{ padding: 0 }}>
          <div className="empty-state-icon" style={{ fontSize: 56, marginBottom: 16 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#cbd5e1" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="empty-state-title" style={{ fontSize: 20, marginBottom: 8 }}>{title}</h2>
          <p className="empty-state-desc" style={{ color: "#64748b", maxWidth: 400, margin: "0 auto 20px" }}>
            This page is under construction. Our team is working hard to bring you this feature soon.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><line x1="16" y1="2" x2="16" y2="22"/></svg>
            </div>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
