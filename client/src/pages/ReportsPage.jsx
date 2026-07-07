import { useState, useMemo } from "react";

const reports = [
  { id: 1, title: "Inventory Summary Report", desc: "Overview of all inventory items, stock levels, and categories.", color: "#3b82f6", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { id: 2, title: "Stock Movement Report", desc: "Detailed log of all stock in and stock out transactions.", color: "#10b981", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  { id: 3, title: "Low Stock & Alerts Report", desc: "List of items that are low in stock or out of stock.", color: "#f59e0b", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: 4, title: "Purchase Order Report", desc: "Summary of purchase orders by supplier, status, and value.", color: "#6366f1", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { id: 5, title: "Maintenance Report", desc: "Summary of maintenance requests, costs, and completion status.", color: "#ef4444", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
  { id: 6, title: "Warehouse Performance Report", desc: "Stock levels, capacity, and efficiency across warehouses.", color: "#8b5cf6", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { id: 7, title: "Financial Summary Report", desc: "Total inventory value, costs, and purchase order spend.", color: "#a855f7", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg> },
  { id: 8, title: "Audit Trail Report", desc: "User actions, changes, and transaction history.", color: "#64748b", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Reports</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Reports</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export All")}>Export All</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
        </div>
      </div>

      <div className="card">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value="" onChange={() => {}}>
            <option value="">All Categories</option>
          </select>
          <div className="date-range">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>May 01, 2025 - May 30, 2025</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button className="ghost-btn" onClick={() => { setSearch(""); }}>Reset</button>
        </div>

        <div className="grid grid-2" style={{ marginTop: 8 }}>
          {filtered.map((r) => (
            <div key={r.id} className="report-card" onClick={() => alert(`Generating: ${r.title}`)}>
              <div className="report-icon" style={{ background: r.color }}>{r.icon}</div>
              <div>
                <div className="report-title">{r.title}</div>
                <div className="report-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
