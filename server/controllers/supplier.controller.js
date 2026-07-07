import Supplier from "../models/supplier.model.js";

export const getAll = async () => Supplier.find().sort("name");
export const createOne = async (data) => Supplier.create(data);
export const getOne = async (id) => Supplier.findById(id);
export const updateOne = async (id, data) => Supplier.findByIdAndUpdate(id, data, { new: true });
export const remove = async (id) => Supplier.findByIdAndDelete(id);
