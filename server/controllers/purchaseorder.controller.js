import PurchaseOrder from "../models/purchaseorder.model.js";

export const getAll = async () => PurchaseOrder.find().populate("supplier", "name").sort("-createdAt");
export const createOne = async (data) => PurchaseOrder.create(data);
export const getOne = async (id) => PurchaseOrder.findById(id).populate("supplier", "name");
export const updateOne = async (id, data) => PurchaseOrder.findByIdAndUpdate(id, data, { new: true }).populate("supplier", "name");
export const remove = async (id) => PurchaseOrder.findByIdAndDelete(id);
