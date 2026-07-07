import Maintenance from "../models/maintenance.model.js";

export const getAll = async (query = {}) => {
  const filters = {};
  if (query.type) filters.type = query.type;
  if (query.priority) filters.priority = query.priority;
  if (query.status) filters.status = query.status;
  if (query.warehouse) filters.warehouse = query.warehouse;
  if (query.search) {
    filters.$or = [
      { requestId: { $regex: query.search, $options: "i" } },
      { item: { $regex: query.search, $options: "i" } },
      { reportedBy: { $regex: query.search, $options: "i" } },
    ];
  }
  return Maintenance.find(filters).sort("-createdAt");
};
export const createOne = async (data) => Maintenance.create(data);
