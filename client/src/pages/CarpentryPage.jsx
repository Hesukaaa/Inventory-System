import { useState, useEffect, useMemo } from "react";
import api from "../lib/api";

const CURRENCY = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

const categoryBadgeColors = {
  Boards: "bg-orange-100 text-orange-700",
  Lumber: "bg-amber-100 text-amber-700",
  Fasteners: "bg-yellow-100 text-yellow-700",
  Hardware: "bg-slate-100 text-slate-700",
  Adhesives: "bg-teal-100 text-teal-700",
  Finishes: "bg-purple-100 text-purple-700",
};

const carpentryData = [
  { id: "CARP-0001", name: "Plywood Board (18mm)", category: "Boards", warehouse: "Cebu Warehouse", stock: 85, unit: "pcs", cost: 850 },
  { id: "CARP-0002", name: "Lumber 2\" x 4\" x 8\'", category: "Lumber", warehouse: "Bacolod Warehouse", stock: 120, unit: "pcs", cost: 320 },
  { id: "CARP-0003", name: "Nails 2\"", category: "Fasteners", warehouse: "Palawan Warehouse", stock: 500, unit: "kg", cost: 95 },
  { id: "CARP-0004", name: "Cabinet Hinge (2\")*1", category: "Hardware", warehouse: "Bacolod Warehouse", stock: 8, unit: "pcs", cost: 45 },
  { id: "CARP-0005", name: "Wood Glue 250ml", category: "Adhesives", warehouse: "Manila Warehouse", stock: 6, unit: "bottle", cost: 120 },
  { id: "CARP-0006", name: "Door Knob (Round)", category: "Hardware", warehouse: "Manila Warehouse", stock: 0, unit: "pcs", cost: 180 },
  { id: "CARP-0007", name: "Wood Screw #8 x 2\"", category: "Fasteners", warehouse: "Iloilo Warehouse", stock: 0, unit: "box", cost: 210 },
  { id: "CARP-0008", name: "Wood Varnish 1L", category: "Finishes", warehouse: "Manila Warehouse", stock: 15, unit: "can", cost: 450 },
];

export default function CarpentryPage() {
  const [products, setProducts] = useState(carpentryData);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    api("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  const warehouses = useMemo(() => {
    const set = new Set(products.map((p) => p.warehouse).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const lowStockCount = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 10).length;
  const outOfStockCount = products.filter((p) => Number(p.stock || 0) === 0).length;
  const totalValue = products.reduce((sum, p) => sum + Number(p.stock || 0) * Number(p.cost || 0), 0);

  const filtered = useMemo(() => {
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (warehouseFilter) list = list.filter((p) => p.warehouse === warehouseFilter);
    if (statusFilter === "in-stock") list = list.filter((p) => Number(p.stock || 0) > 10);
    if (statusFilter === "low-stock") list = list.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 10);
    if (statusFilter === "out-of-stock") list = list.filter((p) => Number(p.stock || 0) === 0);
    return list;
  }, [products, search, categoryFilter, warehouseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, categoryFilter, warehouseFilter, statusFilter]);

  const stockStatus = (p) => {
    const q = Number(p.stock || 0);
    if (q === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
    if (q <= 10) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", className: "bg-green-100 text-green-700" };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Carpentry</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Carpentry</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
          <button className="primary" onClick={() => alert("New Carpentry Item")}>+ New Carpentry Item</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">TOTAL ITEMS</div>
              <div className="stat-value">{totalItems.toLocaleString()}</div>
              <div className="stat-sub">All carpentry items</div>
            </div>
            <div className="stat-icon" style={{ background: "#3b82f6" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 25 Q 10 20, 20 22 T 40 18 T 60 10 T 80 12 T 100 5" fill="none" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">AVAILABLE STOCK</div>
              <div className="stat-value">{totalStock.toLocaleString()}</div>
              <div className="stat-sub">In stock</div>
            </div>
            <div className="stat-icon" style={{ background: "#22c55e" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 20 Q 15 25, 30 18 T 60 15 T 100 8" fill="none" stroke="#22c55e" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">LOW STOCK</div>
              <div className="stat-value">{lowStockCount}</div>
              <div className="stat-sub">Running low</div>
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

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">OUT OF STOCK</div>
              <div className="stat-value">{outOfStockCount}</div>
              <div className="stat-sub">Out of stock</div>
            </div>
            <div className="stat-icon" style={{ background: "#ef4444" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 10 Q 20 15, 40 8 T 70 12 T 100 5" fill="none" stroke="#ef4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">TOTAL VALUE</div>
              <div className="stat-value">{CURRENCY.format(totalValue)}</div>
              <div className="stat-sub">Total inventory value</div>
            </div>
            <div className="stat-icon" style={{ background: "#6366f1" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 22 Q 20 18, 40 20 T 70 15 T 100 10" fill="none" stroke="#6366f1" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search by item name, code, or description..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setCategoryFilter(""); setWarehouseFilter(""); setStatusFilter(""); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Reset</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Unit Cost</th>
                <th>Total Value</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const status = stockStatus(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="item-cell">
                        <div className="item-icon">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&size=32`} alt="" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: "#0f172a" }}>{p.name}</div>
                          <div className="item-code">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <div className="warehouse-cell">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        {p.warehouse}
                      </div>
                    </td>
                    <td style={{ color: Number(p.stock || 0) === 0 ? "#ef4444" : Number(p.stock || 0) <= 10 ? "#f59e0b" : "#10b981", fontWeight: 600 }}>{p.stock}</td>
                    <td>{p.unit}</td>
                    <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                    <td>₱{Number(p.cost || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>₱{(Number(p.stock || 0) * Number(p.cost || 0)).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="View" onClick={() => alert(`View ${p.name}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${p.name}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                        </button>
                        <button className="icon-btn" title="More" onClick={() => alert(`More options for ${p.name}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No carpentry items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} items</div>
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
