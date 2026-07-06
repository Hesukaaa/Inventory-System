import { useEffect, useState } from "react";
import Login from "./components/Login";

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
      // fallback social login or throw
      const user = { email: data.email, name: data.name || data.email, token: null };
      localStorage.setItem("ims_user", JSON.stringify(user));
      setUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem("ims_user");
    setUser(null);
  };

  return { user, login, logout };
}

function Nav({ tab, setTab, onLogout }) {
  return (
    <header className="container">
      <h1>Inventory System</h1>
      <nav className="flex">
        <button className={tab === "dashboard" ? "primary" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={tab === "products" ? "primary" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "categories" ? "primary" : ""} onClick={() => setTab("categories")}>Categories</button>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
}

function Dashboard({ products, categories }) {
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStock = products.filter((p) => p.quantity <= (p.lowStockThreshold || 10)).length;
  const totalValue = products.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0);

  const cards = [
    { label: "Total Products", value: totalProducts },
    { label: "Categories", value: totalCategories },
    { label: "Low Stock Items", value: lowStock },
    { label: "Inventory Value", value: `$${totalValue.toFixed(2)}` },
  ];

  return (
    <div className="container">
      <div className="grid grid-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <h3>{c.label}</h3>
            <p style={{ fontSize: 28, fontWeight: 700 }}>{c.value}</p>
          </div>
        ))}
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

function Products({ categories, refresh }) {
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
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price),
      description: form.description,
      lowStockThreshold: Number(form.lowStockThreshold),
    };
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
    <div className="container">
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

function Categories({ refresh }) {
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
    <div className="container">
      <div className="card">
        <h3>Categories</h3>
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

export default function App() {
  const { user, login, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const refresh = async () => {
    setProducts(await api("/products"));
    setCategories(await api("/categories"));
  };

  useEffect(() => { refresh(); }, []);

  if (!user) return <Login onLogin={login} />;

  return (
    <>
      <Nav tab={tab} setTab={setTab} onLogout={logout} />
      {tab === "dashboard" && <Dashboard products={products} categories={categories} />}
      {tab === "products" && <Products categories={categories} refresh={refresh} />}
      {tab === "categories" && <Categories refresh={refresh} />}
    </>
  );
}
