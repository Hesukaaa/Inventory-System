import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

const SCHEMA = {
  users: [],
  categories: [],
  products: [],
  warehouses: [],
  suppliers: [],
  purchaseOrders: [],
  stockTransactions: [],
  maintenance: [],
};

let data = {};
let initialized = false;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function shallowMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = shallowMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function matches(item, filter) {
  if (!filter) return true;
  const keys = Object.keys(filter);
  for (const key of keys) {
    const val = filter[key];
    if (key === "$or" && Array.isArray(val)) {
      if (!val.some((sub) => matches(item, sub))) return false;
    } else if (key === "$regex" || key === "$options") {
      continue;
    } else if (val && typeof val === "object" && Object.keys(val).length) {
      const cmpKey = Object.keys(val)[0];
      const cmpVal = val[cmpKey];
      const itemVal = item[key];
      if (cmpKey === "$regex") {
        const flags = filter.$options === "i" ? "i" : "";
        const regex = new RegExp(cmpVal, flags);
        if (!regex.test(String(itemVal || ""))) return false;
      } else if (cmpKey === "$lte") {
        if (Number(itemVal) > Number(cmpVal)) return false;
      } else if (cmpKey === "$gte") {
        if (Number(itemVal) < Number(cmpVal)) return false;
      } else if (cmpKey === "$ne") {
        if (itemVal === cmpVal) return false;
      } else {
        if (itemVal !== cmpVal) return false;
      }
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

class DB {
  collection(name) {
    const list = () => data[name] || [];
    return {
      find: (filter = {}) => list().filter((item) => matches(item, filter)),
      findOne: (filter = {}) => list().find((item) => matches(item, filter)) || null,
      findById: (id) => list().find((item) => String(item._id) === String(id)) || null,
      findByIdAndUpdate: (id, update, opts = {}) => {
        const idx = list().findIndex((item) => String(item._id) === String(id));
        if (idx < 0) return null;
        const merged = shallowMerge(list()[idx], update);
        merged.updatedAt = new Date().toISOString();
        data[name][idx] = merged;
        return opts.new ? merged : merged;
      },
      findByIdAndDelete: (id) => {
        const idx = list().findIndex((item) => String(item._id) === String(id));
        if (idx < 0) return null;
        const deleted = data[name].splice(idx, 1)[0];
        return deleted;
      },
      create: (row) => {
        const doc = { _id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...row };
        data[name].push(doc);
        return doc;
      },
    };
  }
}

const db = new DB();

export async function initDb() {
  initialized = true;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    data = JSON.parse(raw);
  } catch {
    data = JSON.parse(JSON.stringify(SCHEMA));
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }
  for (const key of Object.keys(SCHEMA)) {
    if (!Array.isArray(data[key])) data[key] = [];
  }
}

export async function persist() {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export default db;
