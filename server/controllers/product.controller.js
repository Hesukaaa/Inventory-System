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
  return Product.find(filters).populate("category", "name").sort("-createdAt");
};

export const createOne = async (data) => Product.create(data);

export const getOne = async (id) => Product.findById(id).populate("category", "name");

export const updateOne = async (id, data) => Product.findByIdAndUpdate(id, data, { new: true }).populate("category", "name");

export const softDelete = async (id) => Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
