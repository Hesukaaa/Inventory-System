import { useState } from "react";
import { LayoutDashboard, Boxes, FolderKanban, Warehouse, ArrowLeftRight, Wrench, Hammer, ShoppingCart, Truck, FileText, Users, Bell, Settings, LogOut, ChevronDown } from "lucide-react";

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

export default Sidebar;
