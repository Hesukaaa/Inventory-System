import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true, trim: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  warehouse: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  items: [{ name: String, quantity: Number, unitPrice: Number }],
  totalItems: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  expectedDelivery: { type: Date },
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
