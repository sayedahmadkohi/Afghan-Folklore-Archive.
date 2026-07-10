import { Router } from "express";
import {
  getAdminStats,
  getAllStoriesAdmin,
  getAllUsersAdmin,
  deleteUser,
} from "../controllers/authController.js";
import protect from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = Router();

router.get("/stats", protect, admin, getAdminStats);
router.get("/stories", protect, admin, getAllStoriesAdmin);
router.get("/users", protect, admin, getAllUsersAdmin);
router.delete("/users/:userId", protect, admin, deleteUser);

export default router;
