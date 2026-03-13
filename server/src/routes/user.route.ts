import { Router } from "express";
import { userSignupController } from "../controllers/user.controller.js";
const router = Router();

router.post("/signup", userSignupController);

export default router;
