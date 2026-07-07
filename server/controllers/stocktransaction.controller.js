import StockTransaction from "../models/stocktransaction.model.js";

export const getAll = async (query = {}) => {
  const filters = {};
  if (query.type) filters.type = query.type;
  if (query.warehouse) filters.warehouse = query.warehouse;
  if (query.status) filters.status = query.status;
  if (query.search) {
    filters.$or = [
      { reference: { $regex: query.search, $options: "i" } },
      { person: { $regex: query.search, $options: "i" } },
    ];
  }
  return StockTransaction.find(filters).sort("-createdAt");
};
export const createOne = async (data) => StockTransaction.create(data);
