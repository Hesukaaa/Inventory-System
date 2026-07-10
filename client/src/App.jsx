import React, { useEffect, useState, useRef } from "react";
import { ToastProvider } from "./components/Toast";
import Login from "./components/Login";
import ResetPasswordPage from "./pages/ResetPasswordPage";
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
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get("token"));
  const [verifying, setVerifying] = useState(true);
  const verifiedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) setResetToken(token);
  }, []);

  useEffect(() => {
    if (verifiedRef.current) return;

    async function verifyAndRoute() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) {
        verifiedRef.current = true;
        setVerifying(false);
        return;
      }

      try {
        const res = await api("/auth/verify", {
          method: "POST",
          body: JSON.stringify({ token }),
        });

        if (res.decoded.type === "reset") {
          setResetToken(token);
        } else {
          setResetToken(null);
          await login({ token, email: res.decoded.email, name: res.decoded.name || "User" });
          window.history.replaceState({}, "", window.location.pathname + window.location.hash);
        }
      } catch {
        setResetToken(null);
      } finally {
        verifiedRef.current = true;
        setVerifying(false);
      }
    }

    verifyAndRoute();
  }, [login]);

  const refresh = async () => {
    try {
      setProducts(await api("/products"));
      setCategories(await api("/categories"));
    } catch {
      // ignore initial load failures
    }
  };

  useEffect(() => { refresh(); }, []);

  if (verifying) {
    return (
      <div className="login-root">
        <div className="login-left">
          <div className="login-left-bg" />
          <div className="login-left-content">
            <div className="login-logo-wrap">
               <img src="/Inventory-System/LOGO-WEBSITE.png" alt="Logo" className="login-logo-img" />
            </div>
            <div className="login-gold-line" />
            <div className="login-headline">
              Smart Inventory.<br />
              Better Operations.
            </div>
            <div className="login-desc">
              Manage inventory, maintenance, and resources efficiently and effortlessly.
            </div>
            <img src="/Inventory-System/image/invento.png" alt="Inventory" className="login-invento-img" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Verifying...</h2>
              <div className="login-sub">Please wait while we verify your login</div>
              <div className="gold-rule" />
            </div>
            <span className="btn-content">
              <span className="btn-spinner" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user && resetToken) return <ResetPasswordPage onLogin={login} />;
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
