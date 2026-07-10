import Warehouse from "../models/warehouse.model.js";

export const getAll = () => Warehouse.getAll();
export const createOne = async (data) => Warehouse.create(data);
