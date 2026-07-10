import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

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
  const items = Product.getAll(filters);
  return items.map((p) => {
    const cat = p.category ? Category.findById(p.category) : null;
    return { ...p, category: cat ? { name: cat.name } : null };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createOne = async (data) => Product.create(data);

export const getOne = async (id) => {
  const item = Product.findById(id);
  if (!item) return null;
  const cat = item.category ? Category.findById(item.category) : null;
  return { ...item, category: cat ? { name: cat.name } : null };
};

export const updateOne = async (id, data) => {
  const item = Product.findByIdAndUpdate(id, data);
  if (!item) return null;
  const cat = item.category ? Category.findById(item.category) : null;
  return { ...item, category: cat ? { name: cat.name } : null };
};

export const softDelete = async (id) => Product.findByIdAndUpdate(id, { isActive: false });
