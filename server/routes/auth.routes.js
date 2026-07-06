import { Router } from "express";
import { register, login, social } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/social", social);

export default router;
