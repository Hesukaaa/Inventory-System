import { useState, useEffect, useMemo } from "react";

const mockUsers = [
  { id: "USR-001", name: "Joel Dibbib", email: "joel@example.com", role: "Administrator", status: "Active", lastLogin: "May 30, 2025" },
  { id: "USR-002", name: "Juan Dela Cruz", email: "juan@example.com", role: "Warehouse Manager", status: "Active", lastLogin: "May 29, 2025" },
  { id: "USR-003", name: "Maria Santos", email: "maria@example.com", role: "Inventory Clerk", status: "Active", lastLogin: "May 28, 2025" },
  { id: "USR-004", name: "Pedro Reyes", email: "pedro@example.com", role: "Viewer", status: "Inactive", lastLogin: "May 20, 2025" },
  { id: "USR-005", name: "Anna Garcia", email: "anna@example.com", role: "Inventory Clerk", status: "Active", lastLogin: "May 27, 2025" },
];

const roleColors = {
  Administrator: "bg-purple-100 text-purple-700",
  "Warehouse Manager": "bg-blue-100 text-blue-700",
  "Inventory Clerk": "bg-green-100 text-green-700",
  Viewer: "bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = users;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
    }
    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
    if (statusFilter) list = list.filter((u) => u.status === statusFilter);
    return list;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const roles = [...new Set(mockUsers.map((u) => u.role))];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Users & Roles</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Users & Roles</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
          <button className="primary" onClick={() => alert("Add New User")}>+ Add New User</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">TOTAL USERS</div>
              <div className="stat-value">{users.length}</div>
              <div className="stat-sub">All users</div>
            </div>
            <div className="stat-icon" style={{ background: "#3b82f6" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 18 Q 20 22, 40 15 T 70 12 T 100 8" fill="none" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">ACTIVE USERS</div>
              <div className="stat-value">{users.filter((u) => u.status === "Active").length}</div>
              <div className="stat-sub">Currently active</div>
            </div>
            <div className="stat-icon" style={{ background: "#10b981" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 22 Q 15 25, 30 18 T 60 15 T 100 8" fill="none" stroke="#10b981" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">INACTIVE USERS</div>
              <div className="stat-value">{users.filter((u) => u.status === "Inactive").length}</div>
              <div className="stat-sub">Currently inactive</div>
            </div>
            <div className="stat-icon" style={{ background: "#f59e0b" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 18 Q 20 22, 40 15 T 70 12 T 100 18" fill="none" stroke="#f59e0b" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search user name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setRoleFilter(""); setStatusFilter(""); }}>Reset</button>
        </div>

        <div className="table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" /></th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => (
                <tr key={u.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="item-cell">
                      <div className="avatar-sm">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=32`} alt="" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: "#0f172a" }}>{u.name}</div>
                        <div className="item-code">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${roleColors[u.role] || "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status === "Active" ? "active" : "inactive"}`}>{u.status}</span></td>
                  <td>{u.lastLogin}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" title="View" onClick={() => alert(`View ${u.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${u.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                      </button>
                      <button className="icon-btn" title="More" onClick={() => alert(`More options for ${u.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} users</div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>›</button>
            <select className="pagination-select" value={pageSize} onChange={(e) => {}}>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
