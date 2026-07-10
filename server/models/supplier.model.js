import db, { persist } from "../db.js";

const col = () => db.collection("suppliers");

export const getAll = () => col().find();
export const findById = (id) => col().findById(id);
export const create = async (data) => {
  const item = col().create(data);
  await persist();
  return item;
};
export const findByIdAndUpdate = (id, data) => {
  const item = col().findByIdAndUpdate(id, data, { new: true });
  persist();
  return item;
};
export const findByIdAndDelete = (id) => {
  const item = col().findByIdAndDelete(id);
  persist();
  return item;
};
