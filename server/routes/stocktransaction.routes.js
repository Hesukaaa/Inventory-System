import { Router } from "express";
import { getAll, createOne } from "../controllers/stocktransaction.controller.js";

const router = Router();
router.get("/", async (req, res, next) => { try { res.json(await getAll(req.query)); } catch (err) { next(err); } });
router.post("/", async (req, res, next) => { try { res.status(201).json(await createOne(req.body)); } catch (err) { next(err); } });

export default router;
