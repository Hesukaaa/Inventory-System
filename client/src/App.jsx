import { useEffect, useState, useMemo } from "react";
import Login from "./components/Login";
import { LayoutDashboard, Boxes, FolderKanban, Warehouse, ArrowLeftRight, Wrench, Hammer, ShoppingCart, Truck, FileText, Users, Bell, Settings, LogOut, ChevronDown, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#f97316", "#eab308", "#10b981", "#6366f1"];

const StatCard = React.memo(function StatCard({ title, value, sub, color, chartType }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ background: color }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {chartType === "box" && <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>}
            {chartType === "chart-up" && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>}
            {chartType === "warning" && <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
            {chartType === "box-out" && <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></>}
            {chartType === "wrench" && <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>}
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value.toLocaleString()}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      </div>
      <div className="stat-chart">
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={[{ value: 40 }, { value: 55 }, { value: 45 }, { value: 70 }, { value: 60 }, { value: 75 }, { value: 65 }, { value: 80 }, { value: 70 }, { value: 85 }]}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const API = "/api";

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers, body: opts.body });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ims_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (data) => {
    try {
      const res = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: data.email, password: data.password }) });
      localStorage.setItem("ims_user", JSON.stringify({ email: res.user.email, name: res.user.name, token: res.token }));
      setUser({ email: res.user.email, name: res.user.name, token: res.token });
    } catch (err) {
      // login failed; keep user unauthenticated
    }
  };

  const logout = () => {
    localStorage.removeItem("ims_user");
    setUser(null);
  };

  return { user, login, logout };
}

function Sidebar({ page, setPage, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "categories", label: "Categories", icon: FolderKanban },
    { id: "warehouses", label: "Warehouses", icon: Warehouse },
    { id: "stock", label: "Stock In / Out", icon: ArrowLeftRight },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "carpentry", label: "Carpentry", icon: Hammer },
    { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 5 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/image/LOGO.png" alt="Logo" className="sidebar-logo-img" />
          {!collapsed && <div className="sidebar-title">iMAGE<br /><span>&amp; MAINTENANCE</span><br />DEPARTMENT</div>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <ChevronDown size={18} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
              {item.badge && !collapsed && <span className="sidebar-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <img src="https://i.pravatar.cc/150?u=joel" alt="Joel" />
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || "Joel Dibbib"}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
        )}
        <button className="sidebar-logout" onClick={onLogout} title="Log Out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

function TopHeader({ user, onToggleNotif }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="top-header">
      <div className="top-header-left">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search for items, categories, serial no..." />
        </div>
      </div>
      <div className="top-header-right">
        <button className="top-icon-btn" title="Notifications" onClick={onToggleNotif}>
          <Bell size={20} />
          <span className="notif-dot" />
        </button>
        <button className="top-icon-btn" title="Calendar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        <button className="top-icon-btn" title="Fullscreen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
        <div className="top-user">
          <div className="top-avatar">
            <img src="https://i.pravatar.cc/150?u=joel" alt="Joel" />
          </div>
          <div className="top-user-info">
            <div className="top-user-name">{user?.name || "Joel Dibbib"}</div>
            <div className="top-user-role">Administrator</div>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

function DashboardPage({ products, categories }) {
  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const lowStock = products.filter((p) => Number(p.quantity || 0) <= (Number(p.lowStockThreshold || 10))).length;
  const outOfStock = products.filter((p) => Number(p.quantity || 0) === 0).length;
  const maintenance = products.filter((p) => p.maintenanceStatus === "pending").length || 0;

  const stockOverview = [
    { name: "May 01", value: 5800 },
    { name: "May 08", value: 6200 },
    { name: "May 15", value: 5900 },
    { name: "May 22", value: 7100 },
    { name: "May 29", value: 7891 },
  ];

  const categoryData = [
    { name: "Electrical", value: 35, count: 860, color: "#3b82f6" },
    { name: "Carpentry", value: 25, count: 615, color: "#f97316" },
    { name: "Tools", value: 12, count: 295, color: "#eab308" },
    { name: "Hardware", value: 20, count: 492, color: "#10b981" },
    { name: "Others", value: 8, count: 194, color: "#6366f1" },
  ];

  const recentActivities = [
    { id: 1, title: "Stock In", desc: "Wall Light Box Cabinet", time: "10:28 AM", icon: "in" },
    { id: 2, title: "Stock Out", desc: "LED Strip Light", time: "09:45 AM", icon: "out" },
    { id: 3, title: "Maintenance Request", desc: "Display Cabinet Repair", time: "Yesterday", icon: "maint" },
    { id: 4, title: "Stock Transfer", desc: "From Cebu to Bacolod", time: "Yesterday", icon: "transfer" },
    { id: 5, title: "Purchase Order", desc: "PO #2025-0529-001", time: "May 29, 2025", icon: "po" },
  ];

  const lowStockItems = [
    { name: "Wall Light Box Cabinet", category: "Electrical", warehouse: "Cebu Warehouse", stock: 5, min: 10, status: "Low Stock" },
    { name: "Aluminum Display Rack", category: "Carpentry", warehouse: "Bacolod Warehouse", stock: 3, min: 8, status: "Low Stock" },
    { name: "LED Bulb 9W", category: "Electrical", warehouse: "Palawan Warehouse", stock: 2, min: 15, status: "Low Stock" },
    { name: "Screw #8 x 1\"", category: "Hardware", warehouse: "Cebu Warehouse", stock: 0, min: 20, status: "Out of Stock" },
    { name: "Cabinet Hinge (2\")", category: "Carpentry", warehouse: "Bacolod Warehouse", stock: 1, min: 10, status: "Low Stock" },
  ];

  const quickActions = [
    { label: "Add Item", icon: "+", href: "#" },
    { label: "Stock In", icon: "↓", href: "#" },
    { label: "Stock Out", icon: "↑", href: "#" },
    { label: "Transfer", icon: "⇄", href: "#" },
    { label: "Maintenance", icon: "🔧", href: "#" },
    { label: "Purchase Order", icon: "📋", href: "#" },
    { label: "Reports", icon: "📊", href: "#" },
    { label: "Categories", icon: "📁", href: "#" },
    { label: "Warehouses", icon: "🏭", href: "#" },
  ];

  const getActivityIcon = (icon) => {
    const color = "#f59e0b";
    switch (icon) {
      case "in": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
      case "out": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
      case "maint": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
      case "transfer": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
      case "po": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
      default: return null;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, Joel! 👋</h1>
          <p className="dashboard-subtitle">Here&apos;s what&apos;s happening with your inventory and maintenance today.</p>
        </div>
        <div className="dashboard-date">
          <div className="date-box">
            <div className="date-main">May 30, 2025</div>
            <div className="date-sub">Friday, 10:30 AM</div>
          </div>
          <ChevronDown size={20} />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="TOTAL ITEMS" value={totalItems} sub="All inventory items" color="#3b82f6" chartType="box" />
        <StatCard title="TOTAL STOCK" value={totalStock} sub="All items in stock" color="#10b981" chartType="chart-up" />
        <StatCard title="LOW STOCK" value={lowStock} sub="Items running low" color="#f59e0b" chartType="warning" />
        <StatCard title="OUT OF STOCK" value={outOfStock} sub="Items out of stock" color="#ef4444" chartType="box-out" />
        <StatCard title="MAINTENANCE" value={maintenance} sub="Pending requests" color="#6366f1" chartType="wrench" />
      </div>

      <div className="dashboard-mid">
        <div className="card chart-card">
          <div className="card-header">
            <h3>Stock Overview</h3>
            <select className="chart-select">
              <option>This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stockOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 9000]} ticks={[0, 2000, 4000, 6000, 8000]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3>Stock by Category</h3>
            <button className="text-btn">View Report</button>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                 <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div className="donut-total">2,456</div>
              <div className="donut-label">Items</div>
            </div>
          </div>
          <div className="category-legend">
            {categoryData.map((c) => (
              <div className="legend-item" key={c.name}>
                <span className="legend-dot" style={{ background: c.color }} />
                <span className="legend-name">{c.name}</span>
                <span className="legend-pct">{c.value}%</span>
                <span className="legend-count">({c.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="card table-card">
          <div className="card-header">
            <h3>Low Stock Items</h3>
            <button className="text-btn">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="item-cell">
                      <div className="item-icon">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&size=32`} alt="" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.warehouse}</td>
                  <td style={{ color: item.stock === 0 ? "#ef4444" : "#f59e0b", fontWeight: 600 }}>{item.stock}</td>
                  <td>{item.min}</td>
                  <td>
                    <span className={`badge ${item.status === "Out of Stock" ? "low" : "ok"}`}>{item.status}</span>
                  </td>
                  <td>
                    <button className="view-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card activities-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((act) => (
              <div className="activity-item" key={act.id}>
                <div className="activity-icon">{getActivityIcon(act.icon)}</div>
                <div className="activity-content">
                  <div className="activity-title">{act.title}</div>
                  <div className="activity-desc">{act.desc}</div>
                </div>
                <div className="activity-time">{act.time}</div>
              </div>
            ))}
          </div>
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="qa-grid">
              {quickActions.map((qa) => (
                <a key={qa.label} href={qa.href} className="qa-btn">
                  <span className="qa-icon">{qa.icon}</span>
                  <span className="qa-label">{qa.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage({ categories, refresh }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (categoryFilter) q.set("category", categoryFilter);
    if (lowStockOnly) q.set("lowStock", "true");
    const data = await api(`/products?${q.toString()}`);
    setProducts(data);
  };

  useEffect(() => { load(); }, [search, categoryFilter, lowStockOnly]);

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

  return (
    <div className="page-container">
      <h1 className="page-title">Products</h1>
      <div className="card">
        <div className="flex">
          <input placeholder="Search name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <label className="flex">
            <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
            Low stock only
          </label>
          <button className="primary" onClick={() => { setEdit(null); setShowForm(true); }}>Add Product</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category?.name}</td>
                  <td>{p.quantity}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.quantity <= (p.lowStockThreshold || 10) ? "low" : "ok"}`}>
                      {p.quantity <= (p.lowStockThreshold || 10) ? "Low stock" : "OK"}
                    </span>
                  </td>
                  <td className="flex" style={{ padding: 8 }}>
                    <button onClick={() => { setEdit(p); setShowForm(true); }}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="7">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <ProductForm categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEdit(null); }} initial={edit} />
      )}
    </div>
  );
}

function CategoriesPage({ refresh }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const data = await api("/categories");
    setCategories(data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      setError("");
      if (!name.trim()) return;
      await api("/categories", { method: "POST", body: JSON.stringify({ name }) });
      setName("");
      load();
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Categories</h1>
      <div className="card">
        <div className="flex">
          <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Category name" />
          <button className="primary" onClick={handleCreate}>Add Category</button>
        </div>
        {error && <div style={{ marginTop: 8, color: "var(--danger)" }}>{error}</div>}
        <ul style={{ marginTop: 16, paddingLeft: 18 }}>
          {categories.map((c) => (
            <li key={c._id}>{c.name}</li>
          ))}
          {categories.length === 0 && <li>No categories yet</li>}
        </ul>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="page-container">
      <h1 className="page-title">{title}</h1>
      <div className="card">
        <p>This page is under construction.</p>
      </div>
    </div>
  );
}

function ProductForm({ categories, onSave, onCancel, initial }) {
  const [form, setForm] = useState(
    initial || { name: "", sku: "", description: "", category: "", quantity: "0", price: "0", lowStockThreshold: "10" }
  );

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? "Edit Product" : "New Product"}</h3>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>SKU</label>
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Low Stock Threshold</label>
          <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex" style={{ justifyContent: "flex-end" }}>
          <button onClick={onCancel}>Cancel</button>
          <button className="primary" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, login, logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const refresh = async () => {
    setProducts(await api("/products"));
    setCategories(await api("/categories"));
  };

  useEffect(() => { refresh(); }, []);

  if (!user) return <Login onLogin={login} />;

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />
      <div className="main-area">
        <TopHeader user={user} onToggleNotif={() => alert("Notifications")} />
        <main className="main-content">
          {page === "dashboard" && <DashboardPage products={products} categories={categories} />}
          {page === "products" && <ProductsPage categories={categories} refresh={refresh} />}
          {page === "categories" && <CategoriesPage refresh={refresh} />}
          {page === "inventory" && <ProductsPage categories={categories} refresh={refresh} />}
          {["warehouses", "stock", "maintenance", "carpentry", "purchase-orders", "suppliers", "reports", "users", "notifications", "settings"].includes(page) && <PlaceholderPage title={page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')} />}
        </main>
      </div>
    </div>
  );
}
