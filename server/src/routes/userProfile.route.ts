import { Router } from "express";
import {
  avatarUploadController,
  bioUpdateController,
  getCurrentUser,
  getUserProfile,
} from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multerMiddleware";
const router = Router();
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));
router.get("/:username", asyncHandler(getUserProfile));
router.post(
  "/avatarUpload",
  authMiddleware,
  upload.single("avatar"),
  asyncHandler(avatarUploadController),
);
router.post("/bioUpdate", authMiddleware, asyncHandler(bioUpdateController));

export default router;
