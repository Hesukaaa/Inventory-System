import Warehouse from "../models/warehouse.model.js";

export const getAll = async () => Warehouse.find().sort("name");
export const createOne = async (data) => Warehouse.create(data);
export const getOne = async (id) => Warehouse.findById(id);
export const updateOne = async (id, data) => Warehouse.findByIdAndUpdate(id, data, { new: true });
export const remove = async (id) => Warehouse.findByIdAndDelete(id);
