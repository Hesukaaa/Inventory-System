import { useState, useEffect, useMemo } from "react";
import api from "../lib/api";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const categoryIcons = {
  Electrical: "⚡",
  Carpentry: "🔨",
  Hardware: "🔧",
  Tools: "🛠️",
  Materials: "📦",
  Finishing: "🎨",
  Others: "📁",
};

const categoryColors = {
  Electrical: "#3b82f6",
  Carpentry: "#f97316",
  Hardware: "#10b981",
  Tools: "#eab308",
  Materials: "#ec4899",
  Finishing: "#a855f7",
  Others: "#6366f1",
};

const statusOptions = ["", "Active", "Inactive"];

export default function CategoriesPage({ refresh }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    const data = await api("/categories");
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = categories;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    if (statusFilter) {
      list = list.filter((c) => (c.status || "Active") === statusFilter);
    }
    return list;
  }, [categories, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  const totalItems = categories.length;
  const activeCount = categories.filter((c) => (c.status || "Active") === "Active").length;
  const inactiveCount = categories.filter((c) => (c.status || "Active") === "Inactive").length;
  const totalStock = categories.reduce((sum, c) => sum + Number(c.totalItems || 0), 0);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const sparklineData = [
    { value: 18 }, { value: 22 }, { value: 20 }, { value: 25 }, { value: 23 }, { value: 28 }, { value: 26 }, { value: 30 }, { value: 28 }, { value: 32 },
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
          <path d={`M0 ${28 - sparklineData[0].value * 0.8} Q 12 ${28 - sparklineData[2].value * 0.8}, 25 ${28 - sparklineData[4].value * 0.8} T 55 ${28 - sparklineData[6].value * 0.8} T 100 ${28 - sparklineData[9].value * 0.8}`} fill="none" stroke={color} strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="page-container page-enter">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Categories</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Categories</div>
        </div>
        <div className="page-header-actions actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
          <button className="primary" onClick={() => alert("Add New Category")}>+ Add New Category</button>
        </div>
      </div>

      <div className="stats-grid stagger">
        {loading ? (
          <>
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
          </>
        ) : (
          <>
            <StatCard title="TOTAL CATEGORIES" value={totalItems} sub="All categories" color="#3b82f6" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>} />
            <StatCard title="ACTIVE CATEGORIES" value={activeCount} sub="Currently active" color="#10b981" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
            <StatCard title="INACTIVE CATEGORIES" value={inactiveCount} sub="Currently inactive" color="#f59e0b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>} />
            <StatCard title="TOTAL ITEMS" value={totalStock.toLocaleString()} sub="Across all categories" color="#a855f7" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>} />
          </>
        )}
      </div>

      <div className="card hover-lift">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search category name or description..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s || "All Status"}</option>
            ))}
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setStatusFilter(""); }}>Reset</button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <Skeleton.Table rows={8} cols={7} />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/>
                </svg>
              }
              title="No categories yet"
              description="Get started by creating your first category to organize your inventory."
              action={<button className="ghost-btn" onClick={() => { setSearch(""); setStatusFilter(""); }}>Clear Filters</button>}
            />
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" /></th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Total Items</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c) => {
                  const status = c.status || "Active";
                  const color = categoryColors[c.name] || "#6366f1";
                  const icon = categoryIcons[c.name] || "📁";
                  return (
                    <tr key={c._id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="item-cell">
                          <div className="item-icon" style={{ background: `${color}1a`, color }}>
                            <span style={{ fontSize: 16 }}>{icon}</span>
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td>{c.description || "—"}</td>
                      <td>{Number(c.totalItems || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${status === "Active" ? "active" : "inactive"}`}>{status}</span>
                      </td>
                      <td>{c.createdAt || "—"}</td>
                      <td>
                        <div className="action-btns actions">
                          <button className="icon-btn" title="View" onClick={() => alert(`View ${c.name}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${c.name}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                          </button>
                          <button className="icon-btn" title="More" onClick={() => alert(`More options for ${c.name}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} categories</div>
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
