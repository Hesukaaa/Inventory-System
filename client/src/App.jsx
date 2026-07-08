import React, { useEffect, useState } from "react";
import { ToastProvider } from "./components/Toast";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import WarehousesPage from "./pages/WarehousesPage";
import StockInOutPage from "./pages/StockInOutPage";
import MaintenancePage from "./pages/MaintenancePage";
import CarpentryPage from "./pages/CarpentryPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import ProductForm from "./components/ProductForm";
import PlaceholderPage from "./pages/PlaceholderPage";
import SuppliersPage from "./pages/SuppliersPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import api from "./lib/api";

function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ims_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async (data) => {
    try {
      if (data.token) {
        localStorage.setItem("ims_user", JSON.stringify({ email: data.email, name: data.name, token: data.token }));
        setUser({ email: data.email, name: data.name, token: data.token });
        return;
      }
      const res = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: data.email, password: data.password }) });
      localStorage.setItem("ims_user", JSON.stringify({ email: res.user.email, name: res.user.name, token: res.token }));
      setUser({ email: res.user.email, name: res.user.name, token: res.token });
    } catch (err) {
      // login failed; keep user unauthenticated
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("ims_user");
    setUser(null);
  };

  return { user, login, logout };
}

function App() {
  const { user, login, logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const refresh = async () => {
    try {
      setProducts(await api("/products"));
      setCategories(await api("/categories"));
    } catch {
      // ignore initial load failures
    }
  };

  useEffect(() => { refresh(); }, []);

  if (!user) return <Login onLogin={login} />;

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} />
      <div className="main-area">
        <TopHeader user={user} onToggleNotif={() => {}} />
        <main className="main-content page-enter">
          {page === "dashboard" && <DashboardPage products={products} categories={categories} />}
          {page === "products" && <ProductsPage categories={categories} refresh={refresh} />}
          {page === "categories" && <CategoriesPage refresh={refresh} />}
          {page === "inventory" && <ProductsPage categories={categories} refresh={refresh} />}
          {page === "warehouses" && <WarehousesPage />}
          {page === "stock" && <StockInOutPage />}
          {page === "maintenance" && <MaintenancePage />}
          {page === "carpentry" && <CarpentryPage />}
          {page === "purchase-orders" && <PurchaseOrdersPage />}
          {page === "suppliers" && <SuppliersPage />}
          {page === "reports" && <ReportsPage />}
          {page === "users" && <UsersPage />}
          {page === "notifications" && <NotificationsPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
