import Supplier from "../models/supplier.model.js";

export const getAll = () => Supplier.getAll();
export const createOne = async (data) => Supplier.create(data);
