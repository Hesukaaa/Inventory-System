import Category from "../models/category.model.js";

export const getAll = () => Category.getAll();

export const createOne = async (data) => Category.create(data);
