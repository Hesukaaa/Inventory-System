import { useState, useEffect } from "react";
import api from "../lib/api";
import { useToast } from "../components/Toast";

export default function ProductForm({ categories, onSave, onCancel, initial }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    initial || { name: "", sku: "", description: "", category: "", quantity: "0", price: "0", lowStockThreshold: "10" }
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (!form.category) errs.category = "Category is required";
    if (Number(form.quantity) < 0) errs.quantity = "Must be 0 or more";
    if (Number(form.price) < 0) errs.price = "Must be 0 or more";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the validation errors");
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await onSave(form);
      toast.success(initial ? "Product updated" : "Product created");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    toast.info("Changes discarded");
    onCancel();
  };

  const field = (label, required, jsx) => (
    <div className="form-group">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      {jsx}
      {errors[label.toLowerCase().replace(/\s+/g, "")] && (
        <span className="error-msg">{errors[label.toLowerCase().replace(/\s+/g, "")]}</span>
      )}
    </div>
  );

  const errorKey = (key) => errors[key.toLowerCase().replace(/\s+/g, "")];

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">×</button>
        <h3>{initial ? "Edit Product" : "New Product"}</h3>
        {field("Name", true,
          <input
            autoFocus
            className={errorKey("name") ? "input-error" : ""}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        {field("SKU", true,
          <input
            className={errorKey("sku") ? "input-error" : ""}
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        )}
        {field("Category", true,
          <select
            className={errorKey("category") ? "input-error" : ""}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
        <div className="grid grid-2">
          <div className="form-group">
            <label>Quantity <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              className={errorKey("quantity") ? "input-error" : ""}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            {errorKey("quantity") && <span className="error-msg">{errorKey("quantity")}</span>}
          </div>
          <div className="form-group">
            <label>Price <span className="required">*</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={errorKey("price") ? "input-error" : ""}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errorKey("price") && <span className="error-msg">{errorKey("price")}</span>}
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
          <button onClick={handleCancel} disabled={saving}>Cancel</button>
          <button className="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
