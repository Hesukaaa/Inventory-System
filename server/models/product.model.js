import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  sku: { type: String, required: true, unique: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, required: true, default: 10, min: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
