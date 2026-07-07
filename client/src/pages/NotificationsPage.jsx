import { useState } from "react";

const notifications = [
  { id: 1, title: "New Purchase Order Created", desc: 'PO #2025-0530-011 from ABC Hardware Corp. for Cebu Warehouse', time: "10 min ago", type: "admin" },
  { id: 2, title: "Low Stock Alert", desc: "Wall Light Box Cabinet is running low in Cebu Warehouse (5 left)", time: "30 min ago", type: "system" },
  { id: 3, title: "Maintenance Request Updated", desc: 'MNT-2025-011 status changed to "In Progress"', time: "1 hour ago", type: "admin" },
  { id: 4, title: "Stock Transfer Completed", desc: "Transferred 15 pcs Aluminum Display Rack from Cebu to Bacolod", time: "2 hours ago", type: "system" },
  { id: 5, title: "New User Registered", desc: "Robert Lim created an account and joined the Inventory team", time: "Yesterday", type: "admin" },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Notifications</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Notifications</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Mark all as read")}>Mark all as read</button>
        </div>
      </div>

      <div className="card">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search notifications..." />
          </div>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Notifications</option>
            <option value="admin">Admin</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="notif-list">
          {list.map((n) => (
            <div key={n.id} className="notif-item">
              <div className={`notif-icon ${n.type}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-desc">{n.desc}</div>
              </div>
              <div className="notif-time">{n.time}</div>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No notifications found</div>
          )}
        </div>
      </div>
    </div>
  );
}
