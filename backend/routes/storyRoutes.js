import { Router } from "express";
import {
  getStories,
  getMyStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  toggleLike,
  incrementView,
  approveStory,
  rejectStory,
} from "../controllers/storyController.js";
import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getStories);
router.get("/my", protect, getMyStories);
router.get("/:id", getStory);
router.post("/", protect, upload.single("image"), createStory);
router.put("/:id", protect, upload.single("image"), updateStory);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/view", incrementView);
router.delete("/:id", protect, deleteStory);
router.put("/:id/approve", protect, admin, approveStory);
router.put("/:id/reject", protect, admin, rejectStory);

export default router;
