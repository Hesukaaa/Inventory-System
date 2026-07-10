import { getAll as getProducts, create as createProduct, findById as findProductById, findByIdAndUpdate as updateProduct, findByIdAndDelete as deleteProduct } from "../models/product.model.js";
import { findById as findCategoryById } from "../models/category.model.js";

export const getAll = async (search, category, lowStock) => {
  const filters = { isActive: true };
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filters.category = category;
  if (lowStock === "true") filters.quantity = { $lte: 10 };
  const items = getProducts(filters);
  return items.map((p) => {
    const cat = p.category ? findCategoryById(p.category) : null;
    return { ...p, category: cat ? { name: cat.name } : null };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createOne = async (data) => createProduct(data);

export const getOne = async (id) => {
  const item = findProductById(id);
  if (!item) return null;
  const cat = item.category ? findCategoryById(item.category) : null;
  return { ...item, category: cat ? { name: cat.name } : null };
};

export const updateOne = async (id, data) => {
  const item = updateProduct(id, data);
  if (!item) return null;
  const cat = item.category ? findCategoryById(item.category) : null;
  return { ...item, category: cat ? { name: cat.name } : null };
};

export const softDelete = async (id) => updateProduct(id, { isActive: false });
