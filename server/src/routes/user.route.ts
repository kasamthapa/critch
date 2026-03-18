import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getCurrentUser,
  refreshTokenController,
  userSignInController,
  userSignupController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.post("/signup", asyncHandler(userSignupController));
router.post("/signin", asyncHandler(userSignInController));
router.post("/refresh", asyncHandler(refreshTokenController));
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));

export default router;
