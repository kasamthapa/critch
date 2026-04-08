import { Router } from "express";
import { getCurrentUser, getUserProfile } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));
router.get("/:username", asyncHandler(getUserProfile));

export default router;
