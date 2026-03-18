import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  refreshTokenController,
  userSignInController,
  userSignupController,
} from "../controllers/user.controller";
const router = Router();

router.post("/signup", asyncHandler(userSignupController));
router.post("/signin", asyncHandler(userSignInController));
router.post("/refresh", asyncHandler(refreshTokenController));

export default router;
