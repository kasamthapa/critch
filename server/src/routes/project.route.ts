import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCommentController,
  createProjectController,
  createReviewController,
  deleteProjectController,
  editProjectController,
  getCommentController,
  getOneProjecttController,
  getProjectController,
  getReviewController,
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
router.get("/:projectId/reviews", asyncHandler(getReviewController));
export default router;

router.post(
  "/:projectId/comments",
  authMiddleware,
  asyncHandler(createCommentController),
);
router.get("/:projectId/comments", asyncHandler(getCommentController));
