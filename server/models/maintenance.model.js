import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true, trim: true },
  item: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Repair", "Replace", "Inspect", "Maintenance"], required: true },
  reportedBy: { type: String, required: true, trim: true },
  warehouse: { type: String, required: true, trim: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed", "Overdue"], default: "Pending" },
  reportedDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  cost: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.model("Maintenance", maintenanceSchema);
