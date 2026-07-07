import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import StatCard from "../components/StatCard";

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

function getActivityIcon(icon) {
  const color = "#f59e0b";
  switch (icon) {
    case "in": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
    case "out": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "maint": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case "transfer": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
    case "po": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    default: return null;
  }
}

export default function DashboardPage({ products, categories }) {
  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const lowStock = products.filter((p) => Number(p.quantity || 0) <= (Number(p.lowStockThreshold || 10))).length;
  const outOfStock = products.filter((p) => Number(p.quantity || 0) === 0).length;
  const maintenance = products.filter((p) => p.maintenanceStatus === "pending").length || 0;

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
