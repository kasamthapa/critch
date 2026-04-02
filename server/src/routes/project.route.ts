import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProjectController,
  getProjectController,
} from "../controllers/project.controller";
import { upload } from "../middleware/multerMiddleware";
const router = Router();

router.get("/", asyncHandler(getProjectController));
router.post(
  "/create",
  authMiddleware,
  upload.single("screenshot"),
  asyncHandler(createProjectController),
);

export default router;
