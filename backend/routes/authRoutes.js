import { Router } from "express";
import {
  register,
  login,
  getMe,
  acceptRules,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  toggleSave,
  getSavedStories,
  changePassword,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.put("/accept-rules", protect, acceptRules);
router.post("/toggle-save/:storyId", protect, toggleSave);
router.get("/saved-stories", protect, getSavedStories);
router.put("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);

export default router;
