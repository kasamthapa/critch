import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  userSignInController,
  userSignupController,
} from "../controllers/user.controller";
const router = Router();

router.post("/signup", asyncHandler(userSignupController));
router.post("/signin", asyncHandler(userSignInController));

export default router;
