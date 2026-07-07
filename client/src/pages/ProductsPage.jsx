import { useState, useEffect, useMemo } from "react";
import api from "../lib/api";

const CURRENCY = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

const categoryBadgeColors = {
  Electrical: "bg-blue-100 text-blue-700",
  Carpentry: "bg-orange-100 text-orange-700",
  Tools: "bg-yellow-100 text-yellow-700",
  Hardware: "bg-green-100 text-green-700",
  Materials: "bg-pink-100 text-pink-700",
  Finishing: "bg-purple-100 text-purple-700",
};

export default function ProductsPage({ categories, refresh }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const warehouses = useMemo(() => {
    const set = new Set(products.map((p) => p.warehouse).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const lowStockCount = products.filter((p) => Number(p.quantity || 0) <= (Number(p.lowStockThreshold || 10))).length;
  const outOfStockCount = products.filter((p) => Number(p.quantity || 0) === 0).length;
  const totalValue = products.reduce((sum, p) => sum + Number(p.quantity || 0) * Number(p.price || 0), 0);

  const load = async () => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (categoryFilter) q.set("category", categoryFilter);
    if (lowStockOnly) q.set("lowStock", "true");
    const data = await api(`/products?${q.toString()}`);
    setProducts(data);
  };

  useEffect(() => { load(); }, [search, categoryFilter, lowStockOnly]);

  const filtered = useMemo(() => {
    let list = products;
    if (warehouseFilter) list = list.filter((p) => p.warehouse === warehouseFilter);
    if (statusFilter === "in-stock") list = list.filter((p) => Number(p.quantity || 0) > (Number(p.lowStockThreshold || 10)));
    if (statusFilter === "low-stock") list = list.filter((p) => Number(p.quantity || 0) > 0 && Number(p.quantity || 0) <= (Number(p.lowStockThreshold || 10)));
    if (statusFilter === "out-of-stock") list = list.filter((p) => Number(p.quantity || 0) === 0);
    return list;
  }, [products, warehouseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, categoryFilter, warehouseFilter, statusFilter, lowStockOnly]);

  const handleSave = async (form) => {
    const payload = { name: form.name, sku: form.sku, category: form.category, quantity: Number(form.quantity), price: Number(form.price), description: form.description, lowStockThreshold: Number(form.lowStockThreshold) };
    if (edit) {
      await api(`/products/${edit._id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      await api("/products", { method: "POST", body: JSON.stringify(payload) });
    }
    setShowForm(false);
    setEdit(null);
    load();
    refresh();
  };

  const handleDelete = async (id) => {
    await api(`/products/${id}`, { method: "DELETE" });
    load();
    refresh();
  };

  const stockStatus = (p) => {
    const q = Number(p.quantity || 0);
    if (q === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
    if (q <= (Number(p.lowStockThreshold || 10))) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", className: "bg-green-100 text-green-700" };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Inventory</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Inventory</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Import Excel")}>Import Excel</button>
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}>Print</button>
          <button className="primary" onClick={() => { setEdit(null); setShowForm(true); }}>+ Add New Item</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">TOTAL ITEMS</div>
              <div className="stat-value">{totalItems.toLocaleString()}</div>
              <div className="stat-sub">All inventory items</div>
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
              <div className="stat-title">TOTAL STOCK</div>
              <div className="stat-value">{totalStock.toLocaleString()}</div>
              <div className="stat-sub">All items in stock</div>
            </div>
            <div className="stat-icon" style={{ background: "#10b981" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
          </div>
          <div className="stat-chart">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
              <path d="M0 20 Q 15 25, 30 18 T 60 15 T 100 8" fill="none" stroke="#10b981" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-title">LOW STOCK</div>
              <div className="stat-value">{lowStockCount}</div>
              <div className="stat-sub">Items running low</div>
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
              <div className="stat-sub">Items out of stock</div>
            </div>
            <div className="stat-icon" style={{ background: "#ef4444" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
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
              <div className="stat-sub">Inventory total value</div>
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
            <input placeholder="Search item name, code, or barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
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
          <button className="ghost-btn" onClick={() => { setSearch(""); setCategoryFilter(""); setWarehouseFilter(""); setStatusFilter(""); setLowStockOnly(false); }}>Reset</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" /></th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Unit</th>
                <th>Current Stock</th>
                <th>Min. Stock</th>
                <th>Status</th>
                <th>Unit Cost</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const status = stockStatus(p);
                const badgeClass = categoryBadgeColors[p.category?.name] || "bg-gray-100 text-gray-700";
                return (
                  <tr key={p._id}>
                    <td><input type="checkbox" /></td>
                    <td>{p.sku}</td>
                    <td>
                      <div className="item-cell">
                        <div className="item-icon">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&size=32`} alt="" />
                        </div>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${badgeClass}`}>{p.category?.name}</span></td>
                    <td>
                      <div className="warehouse-cell">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        {p.warehouse}
                      </div>
                    </td>
                    <td>pcs</td>
                    <td style={{ color: Number(p.quantity || 0) === 0 ? "#ef4444" : Number(p.quantity || 0) <= (Number(p.lowStockThreshold || 10)) ? "#f59e0b" : "#10b981", fontWeight: 600 }}>{p.quantity}</td>
                    <td>{p.lowStockThreshold || 10}</td>
                    <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                    <td>₱{Number(p.price || 0).toFixed(2)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="View" onClick={() => alert(`View ${p.name}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => { setEdit(p); setShowForm(true); }}>
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
                  <td colSpan="11" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No products found</td>
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
            <select value={pageSize} onChange={(e) => {}}>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <ProductForm categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEdit(null); }} initial={edit} />
      )}
    </div>
  );
}
