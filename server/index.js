import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import purchaseOrderRoutes from "./routes/purchaseorder.routes.js";
import stockTransactionRoutes from "./routes/stocktransaction.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import { initDb } from "./db.js";

await initDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", authRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/stock-transactions", stockTransactionRoutes);
app.use("/api/maintenance", maintenanceRoutes);

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/api/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
