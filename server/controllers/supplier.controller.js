import { getAll as getSuppliers, findById as findSupplierById, create as createSupplier, findByIdAndUpdate as updateSupplier, findByIdAndDelete as deleteSupplier } from "../models/supplier.model.js";

export const getAll = () => getSuppliers();
export const getOne = (id) => findSupplierById(id);
export const createOne = async (data) => createSupplier(data);
export const updateOne = (id, data) => updateSupplier(id, data);
export const remove = (id) => deleteSupplier(id);
