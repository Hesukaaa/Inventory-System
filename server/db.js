import fs from "fs/promises";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");

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
let mongoClient = null;
let mongoDb = null;
let useMongo = false;

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
    const itemVal = item ? item[key] : undefined;
    if (key === "$or" && Array.isArray(val)) {
      if (!val.some((sub) => matches(item, sub))) return false;
    } else if (key === "$regex" || key === "$options") {
      continue;
    } else if (val && typeof val === "object" && Object.keys(val).length) {
      const cmpKey = Object.keys(val)[0];
      const cmpVal = val[cmpKey];
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
      if (itemVal !== val) return false;
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
        if (useMongo) {
          const docId = typeof id === "string" ? id : String(id);
          mongoDb.collection(name).replaceOne({ _id: docId }, { ...merged, _id: docId }).catch(() => {});
        }
        return opts.new ? merged : merged;
      },
      findByIdAndDelete: (id) => {
        const idx = list().findIndex((item) => String(item._id) === String(id));
        if (idx < 0) return null;
        const deleted = data[name].splice(idx, 1)[0];
        if (useMongo) {
          const docId = typeof id === "string" ? id : String(id);
          mongoDb.collection(name).deleteOne({ _id: docId }).catch(() => {});
        }
        return deleted;
      },
      create: (row) => {
        const doc = { _id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...row };
        data[name].push(doc);
        if (useMongo) {
          mongoDb.collection(name).insertOne({ ...doc }).catch(() => {});
        }
        return doc;
      },
    };
  }
}

const db = new DB();

export async function initDb() {
  initialized = true;
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      mongoDb = mongoClient.db(process.env.MONGODB_DB || "inventory");
      useMongo = true;
      console.log("MongoDB connected");
      for (const key of Object.keys(SCHEMA)) {
        try {
          const docs = await mongoDb.collection(key).find({}).toArray();
          data[key] = docs.map((d) => {
            let _id = d._id;
            if (_id && typeof _id === "object" && _id.toString) {
              _id = _id.toString();
            } else {
              _id = String(_id);
            }
            return { ...d, _id };
          });
        } catch {
          data[key] = [];
        }
      }
      if (!data.users) data.users = [];
    } catch (err) {
      console.error("MongoDB connection failed, using local db.json:", err.message);
      mongoClient = null;
      mongoDb = null;
      useMongo = false;
      await initLocal();
    }
  } else {
    await initLocal();
  }
}

async function initLocal() {
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
  if (!useMongo) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }
}

export default db;
