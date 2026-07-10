import db, { persist } from "../db.js";

const col = () => db.collection("maintenance");

export const getAll = (filters = {}) => col().find(filters);
export const create = async (data) => {
  const item = col().create(data);
  await persist();
  return item;
};
