import Category from "../models/category.model.js";

export const getAll = async () => Category.find().sort("name");

export const createOne = async (data) => Category.create(data);
