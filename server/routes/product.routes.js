import { Router } from "express";
import { getAll, getOne, createOne, updateOne, softDelete } from "../controllers/product.controller.js";

const router = Router();
router.get("/", async (req, res, next) => {
  try {
    const { search, category, lowStock } = req.query;
    const data = await getAll(search, category, lowStock);
    res.json(data);
  } catch (err) { next(err); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const item = await getOne(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
});
router.post("/", async (req, res, next) => {
  try {
    const item = await createOne(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
});
router.put("/:id", async (req, res, next) => {
  try {
    const item = await updateOne(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
});
router.delete("/:id", async (req, res, next) => {
  try {
    await softDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

export default router;
