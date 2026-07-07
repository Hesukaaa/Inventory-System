import { Router } from "express";
import { getAll, createOne, getOne, updateOne, remove } from "../controllers/warehouse.controller.js";

const router = Router();
router.get("/", async (req, res, next) => { try { res.json(await getAll()); } catch (err) { next(err); } });
router.post("/", async (req, res, next) => { try { res.status(201).json(await createOne(req.body)); } catch (err) { if (err.code === 11000) return res.status(409).json({ message: "Warehouse already exists" }); next(err); } });
router.get("/:id", async (req, res, next) => { try { res.json(await getOne(req.params.id)); } catch (err) { next(err); } });
router.put("/:id", async (req, res, next) => { try { res.json(await updateOne(req.params.id, req.body)); } catch (err) { next(err); } });
router.delete("/:id", async (req, res, next) => { try { await remove(req.params.id); res.json({ message: "Deleted" }); } catch (err) { next(err); } });

export default router;
