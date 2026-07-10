import db, { persist } from "../db.js";

const col = () => db.collection("purchaseOrders");
const users = () => db.collection("users");

export const getAll = () => col().find();
export const findById = (id) => col().findById(id);
export const create = async (data) => {
  const item = col().create(data);
  await persist();
  return item;
};
export const update = (id, data) => {
  const item = col().findByIdAndUpdate(id, data, { new: true });
  persist();
  return item;
};
export const remove = (id) => {
  const item = col().findByIdAndDelete(id);
  persist();
  return item;
};

export function withPopulatedSupplier(items) {
  return (Array.isArray(items) ? items : [items]).map((item) => {
    if (!item) return item;
    const supplier = item.supplier ? users().findById(item.supplier) : null;
    return { ...item, supplier: supplier ? { name: supplier.name } : null };
  });
}
