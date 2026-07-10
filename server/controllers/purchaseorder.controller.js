import PurchaseOrder from "../models/purchaseorder.model.js";

export const getAll = () => {
  const items = PurchaseOrder.getAll();
  return PurchaseOrder.withPopulatedSupplier(items).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
export const getOne = (id) => PurchaseOrder.withPopulatedSupplier(PurchaseOrder.findById(id));
export const createOne = async (data) => PurchaseOrder.create(data);
export const updateOne = (id, data) => PurchaseOrder.update(id, data);
export const remove = (id) => PurchaseOrder.remove(id);
