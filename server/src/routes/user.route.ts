import { Router } from "express";
import {
  userSignInController,
  userSignupController,
} from "../controllers/user.controller";
const router = Router();

router.post("/signup", userSignupController);
router.post("/signin", userSignInController);

export default router;
