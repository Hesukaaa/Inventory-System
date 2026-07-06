import { Router } from "express";
import { getAll, createOne } from "../controllers/category.controller.js";

const router = Router();
router.get("/", async (req, res, next) => {
  try {
    res.json(await getAll());
  } catch (err) { next(err); }
});
router.post("/", async (req, res, next) => {
  try {
    const item = await createOne(req.body);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Category already exists" });
    next(err);
  }
});

export default router;
