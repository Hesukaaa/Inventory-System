import { Router } from "express";
import { register, login, social, forgotPassword, resetPassword, verifyToken } from "../controllers/auth.controller.js";
import { googleAuth, googleCallback, facebookAuth, facebookCallback } from "../controllers/social.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/social", social);
router.post("/auth/verify", verifyToken);
router.get("/auth/social/google", googleAuth);
router.get("/auth/social/google/callback", googleCallback);
router.get("/auth/social/facebook", facebookAuth);
router.get("/auth/social/facebook/callback", facebookCallback);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

export default router;
