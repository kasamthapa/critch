import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { dashboardPageController } from "../controllers/dashboard.controller";
const router = Router();
router.get("/", authMiddleware, asyncHandler(dashboardPageController));
export default router;
