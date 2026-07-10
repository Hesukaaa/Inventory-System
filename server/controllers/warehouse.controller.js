import { getAll as getWarehouses, findById as findWarehouseById, create as createWarehouse, findByIdAndUpdate as updateWarehouse, findByIdAndDelete as deleteWarehouse } from "../models/warehouse.model.js";

export const getAll = () => getWarehouses();
export const getOne = (id) => findWarehouseById(id);
export const createOne = async (data) => createWarehouse(data);
export const updateOne = (id, data) => updateWarehouse(id, data);
export const remove = (id) => deleteWarehouse(id);
