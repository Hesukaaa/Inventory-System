import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let uid = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++uid;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  const { addToast, removeToast } = ctx;
  return {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    dismiss: removeToast,
  };
}

const typeStyles = {
  success: { border: "#f59e0b", bg: "#fffbeb", icon: "✓" },
  error: { border: "#ef4444", bg: "#fef2f2", icon: "✕" },
  warning: { border: "#f59e0b", bg: "#fffbeb", icon: "!" },
  info: { border: "#3b82f6", bg: "#eff6ff", icon: "i" },
};

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.leaving ? " toast-leave" : " toast-enter"}`}
          style={{ borderLeftColor: typeStyles[t.type].border }}
        >
          <span className="toast-icon" style={{ background: typeStyles[t.type].border, color: "#fff" }}>
            {typeStyles[t.type].icon}
          </span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => onClose(t.id)}>×</button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
}

export default ToastProvider;
export { ToastContainer };
