import { useState, useEffect, useMemo } from "react";
import api from "../lib/api";

const warehouseColors = {
  Cebu: "#3b82f6",
  Bacolod: "#8b5cf6",
  Palawan: "#f59e0b",
  Manila: "#10b981",
  Davao: "#ef4444",
  Iloilo: "#6366f1",
};

const defaultWarehouseIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

const defaultMapPin = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const mockWarehouses = [
  { _id: "1", name: "Cebu Warehouse", location: "Cebu City, Cebu", totalItems: 3245, manager: "Juan Dela Cruz", status: "Active", createdAt: "May 01, 2025", color: "#3b82f6" },
  { _id: "2", name: "Bacolod Warehouse", location: "Bacolod City, Negros Occidental", totalItems: 2156, manager: "Maria Santos", status: "Active", createdAt: "May 01, 2025", color: "#8b5cf6" },
  { _id: "3", name: "Palawan Warehouse", location: "Puerto Princesa, Palawan", totalItems: 1245, manager: "Pedro Reyes", status: "Active", createdAt: "May 02, 2025", color: "#f59e0b" },
  { _id: "4", name: "Manila Warehouse", location: "Manila, Metro Manila", totalItems: 756, manager: "Anna Garcia", status: "Active", createdAt: "May 02, 2025", color: "#10b981" },
  { _id: "5", name: "Davao Warehouse", location: "Davao City, Davao del Sur", totalItems: 389, manager: "Michael Tan", status: "Active", createdAt: "May 03, 2025", color: "#ef4444" },
  { _id: "6", name: "Iloilo Warehouse", location: "Iloilo City, Iloilo", totalItems: 100, manager: "Robert Lim", status: "Inactive", createdAt: "May 05, 2025", color: "#6366f1" },
];

const StatCard = ({ title, value, sub, color, icon }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon-wrap">
        <div className="stat-icon" style={{ background: color }}>{icon}</div>
        <div className="stat-info">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value.toLocaleString()}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      </div>
    </div>
    <div className="stat-chart">
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
        <path d={`M0 28 Q 15 24, 30 26 T 60 18 T 100 ${color === "#ef4444" ? 22 : 10}`} fill="none" stroke={color} strokeWidth="2"/>
      </svg>
    </div>
  </div>
);

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const locations = useMemo(() => {
    const set = new Set(warehouses.map((w) => w.location).filter(Boolean));
    return Array.from(set).sort();
  }, [warehouses]);

  const filtered = useMemo(() => {
    let list = warehouses;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((w) => (w.name || "").toLowerCase().includes(q) || (w.location || "").toLowerCase().includes(q));
    }
    if (statusFilter) {
      list = list.filter((w) => w.status === statusFilter);
    }
    if (locationFilter) {
      list = list.filter((w) => w.location === locationFilter);
    }
    return list;
  }, [warehouses, search, statusFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, statusFilter, locationFilter]);

  const totalItems = warehouses.reduce((sum, w) => sum + Number(w.totalItems || 0), 0);
  const activeCount = warehouses.filter((w) => w.status === "Active").length;
  const inactiveCount = warehouses.filter((w) => w.status === "Inactive").length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Warehouses</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Warehouses</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Excel
          </button>
          <button className="ghost-btn" onClick={() => alert("Print")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: "middle" }}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
          <button className="primary" onClick={() => alert("Add New Warehouse")}>+ Add New Warehouse</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="TOTAL WAREHOUSES" value={warehouses.length} sub="All warehouses" color="#3b82f6" icon={defaultWarehouseIcon} />
        <StatCard title="ACTIVE WAREHOUSES" value={activeCount} sub="Currently active" color="#10b981" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        } />
        <StatCard title="INACTIVE WAREHOUSES" value={inactiveCount} sub="Currently inactive" color="#f59e0b" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        } />
        <StatCard title="TOTAL ITEMS" value={totalItems.toLocaleString()} sub="Across all warehouses" color="#8b5cf6" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        } />
      </div>

      <div className="card">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search warehouse name or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setStatusFilter(""); setLocationFilter(""); }}>Reset</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" /></th>
                <th>Warehouse Name</th>
                <th>Location</th>
                <th>Total Items</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Created At</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((w) => (
                <tr key={w._id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="item-cell">
                      <div className="item-icon" style={{ background: `${w.color}1a`, color: w.color }}>
                        {defaultWarehouseIcon}
                      </div>
                      <span>{w.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="warehouse-cell">
                      {defaultMapPin}
                      {w.location}
                    </div>
                  </td>
                  <td>{Number(w.totalItems || 0).toLocaleString()}</td>
                  <td>
                    <div className="item-cell">
                      <div className="avatar-sm">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.manager)}&background=random&size=32`} alt="" />
                      </div>
                      <span>{w.manager}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${w.status === "Active" ? "active" : "inactive"}`}>{w.status}</span>
                  </td>
                  <td>{w.createdAt}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" title="View" onClick={() => alert(`View ${w.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${w.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                      </button>
                      <button className="icon-btn" title="More" onClick={() => alert(`More options for ${w.name}`)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No warehouses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} warehouses</div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>›</button>
            <select value={pageSize} onChange={(e) => {}}>
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
