import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["Stock In", "Stock Out"], required: true },
  reference: { type: String, required: true, unique: true, trim: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  warehouse: { type: String, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  value: { type: Number, required: true, min: 0 },
  person: { type: String, required: true, trim: true },
  status: { type: String, enum: ["Completed", "Pending", "Cancelled"], default: "Pending" },
  date: { type: Date, default: Date.now },
  time: { type: String },
}, { timestamps: true });

export default mongoose.model("StockTransaction", stockTransactionSchema);
