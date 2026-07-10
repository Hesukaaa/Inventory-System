import { getAll as getCategories, create as createCategory } from "../models/category.model.js";

export const getAll = () => getCategories();
export const createOne = async (data) => createCategory(data);
