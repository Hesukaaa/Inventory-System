import { useState, useEffect, useMemo } from "react";
import api from "../lib/api";

const statusColor = (s) => {
  if (s === "Active") return "active";
  if (s === "Inactive") return "inactive";
  return "ok";
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    const data = await api("/suppliers");
    setSuppliers(data);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = suppliers;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.contactPerson || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q));
    }
    if (statusFilter) list = list.filter((s) => (s.status || "Active") === statusFilter);
    return list;
  }, [suppliers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const totalSuppliers = suppliers.length;
  const activeCount = suppliers.filter((s) => (s.status || "Active") === "Active").length;
  const inactiveCount = suppliers.filter((s) => (s.status || "Active") === "Inactive").length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Suppliers</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Suppliers</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
          <button className="primary" onClick={() => alert("Add New Supplier")}>+ Add New Supplier</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">TOTAL SUPPLIERS</div>
              <div className="stat-value">{totalSuppliers.toLocaleString()}</div>
              <div className="stat-sub">All suppliers</div>
            </div>
            <div className="stat-icon" style={{ background: "#3b82f6" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
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
              <div className="stat-title">ACTIVE</div>
              <div className="stat-value">{activeCount}</div>
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
              <div className="stat-title">INACTIVE</div>
              <div className="stat-value">{inactiveCount}</div>
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
            <input placeholder="Search supplier name or contact..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setStatusFilter(""); }}>Reset</button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" /></th>
                <th>Supplier Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => (
                <tr key={s._id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="item-cell">
                      <div className="item-icon" style={{ background: "#f1f5f9" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                      </div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.contactPerson || "—"}</td>
                  <td>{s.email || "—"}</td>
                  <td>{s.phone || "—"}</td>
                  <td><span className={`badge ${statusColor(s.status)}`}>{s.status || "Active"}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" title="View" onClick={() => alert(`View ${s.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${s.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                      </button>
                      <button className="icon-btn" title="More" onClick={() => alert(`More options for ${s.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No suppliers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} suppliers</div>
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
