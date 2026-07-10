import { getAll as getPurchaseOrders, findById as findPurchaseOrderById, create as createPurchaseOrder, update as updatePurchaseOrder, remove as removePurchaseOrder, withPopulatedSupplier } from "../models/purchaseorder.model.js";

export const getAll = () => {
  const items = getPurchaseOrders();
  return withPopulatedSupplier(items).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
export const getOne = (id) => withPopulatedSupplier(findPurchaseOrderById(id));
export const createOne = async (data) => createPurchaseOrder(data);
export const updateOne = (id, data) => updatePurchaseOrder(id, data);
export const remove = (id) => removePurchaseOrder(id);
