import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createProjectController,
  createReviewController,
  deleteProjectController,
  editProjectController,
  getOneProjecttController,
  getProjectController,
} from "../controllers/project.controller";
import { upload } from "../middleware/multerMiddleware";
const router = Router();

router.get("/", asyncHandler(getProjectController));
router.get("/:id", asyncHandler(getOneProjecttController));
router.post(
  "/create",
  authMiddleware,
  upload.single("screenshot"),
  asyncHandler(createProjectController),
);

router.put(
  "/edit/:projectId",
  authMiddleware,
  asyncHandler(editProjectController),
);
router.delete(
  "/delete/:id",
  authMiddleware,
  asyncHandler(deleteProjectController),
);
router.post(
  "/:projectId/reviews",
  authMiddleware,
  asyncHandler(createReviewController),
);
export default router;
