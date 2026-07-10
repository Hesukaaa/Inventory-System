import db, { persist } from "../db.js";

const col = () => db.collection("users");

export const findByEmail = (email) => col().findOne({ email });
export const findByProvider = (provider, providerId) => col().findOne({ provider, providerId });
export const create = async (data) => {
  const user = col().create(data);
  await persist();
  return user;
};
export const findById = (id) => col().findById(id);
export const findAndUpdate = (id, data) => {
  const user = col().findByIdAndUpdate(id, data, { new: true });
  persist();
  return user;
};
export const findOneAndUpdate = (filter, data) => {
  const user = col().findOne(filter);
  if (!user) return null;
  return col().findByIdAndUpdate(user._id, data, { new: true });
};
