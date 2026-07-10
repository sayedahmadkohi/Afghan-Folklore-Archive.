import jwt from "jsonwebtoken";
import User from "../models/User.js";
import StoryModel from "../models/Story.js";
import {
  generateVerificationCode,
  hashCode,
  getCodeExpiry,
  isCodeExpired,
} from "../utils/tokenUtils.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/sendEmail.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  acceptedRules: user.acceptedRules,
  isEmailVerified: user.isEmailVerified,
  savedStories: user.savedStories || [],
  role: user.role || "user",
});

const assignVerificationCode = async (user) => {
  const code = generateVerificationCode();
  user.emailVerificationToken = hashCode(code);
  user.emailVerificationExpires = getCodeExpiry();
  await user.save();
  await sendVerificationEmail(user.email, code);
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullName?.trim() || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationToken +emailVerificationExpires",
    );

    if (existingUser?.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    if (existingUser && !existingUser.isEmailVerified) {
      existingUser.fullName = fullName.trim();
      existingUser.password = password;
      await assignVerificationCode(existingUser);

      return res.status(200).json({
        message:
          "Account already exists but is not verified. A new verification code has been sent.",
        email: existingUser.email,
        requiresVerification: true,
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      isEmailVerified: false,
    });

    await assignVerificationCode(user);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-email
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !code?.trim()) {
      return res
        .status(400)
        .json({ message: "Please provide email and verification code" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationToken +emailVerificationExpires",
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (
      isCodeExpired(user.emailVerificationExpires) ||
      user.emailVerificationToken !== hashCode(code.trim())
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Email verified successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-verification
export const resendVerification = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationToken +emailVerificationExpires",
    );

    if (!user || user.isEmailVerified) {
      return res.json({
        message:
          "If an unverified account exists for this email, a new verification code has been sent.",
      });
    }

    await assignVerificationCode(user);

    res.json({
      message:
        "If an unverified account exists for this email, a new verification code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordResetToken +passwordResetExpires",
    );

    if (user && user.isEmailVerified) {
      const code = generateVerificationCode();
      user.passwordResetToken = hashCode(code);
      user.passwordResetExpires = getCodeExpiry();
      await user.save();
      await sendPasswordResetEmail(user.email, code);
    }

    res.json({
      message:
        "If an account exists for this email, a password reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !code?.trim() || !newPassword) {
      return res.status(400).json({
        message: "Please provide email, reset code, and new password",
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordResetToken +passwordResetExpires",
    );

    if (
      !user ||
      isCodeExpired(user.passwordResetExpires) ||
      user.passwordResetToken !== hashCode(code.trim())
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(formatUser(user));
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/accept-rules
export const acceptRules = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { acceptedRules: true },
      { new: true },
    );
    res.json(formatUser(user));
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/toggle-save/:storyId
export const toggleSave = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storyIndex = user.savedStories.indexOf(storyId);
    let isSaved;

    if (storyIndex > -1) {
      user.savedStories.splice(storyIndex, 1);
      isSaved = false;
    } else {
      user.savedStories.push(storyId);
      isSaved = true;
    }

    await user.save();
    res.json({ saved: isSaved });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/saved-stories
export const getSavedStories = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("savedStories");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stories = await StoryModel.find({
      _id: { $in: user.savedStories },
    })
      .populate("author", "fullName email")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current password and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/update-profile
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName } = req.body;

    if (!fullName || !fullName.trim()) {
      return res
        .status(400)
        .json({ message: "Please provide a valid username" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim() },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(formatUser(user));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const totalStories = await StoryModel.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const stories = await StoryModel.find();
    const totalViews = stories.reduce((sum, story) => sum + (story.views || 0), 0);
    
    const users = await User.find();
    const totalBookmarks = users.reduce((sum, user) => sum + (user.savedStories?.length || 0), 0);

    res.json({
      totalStories,
      totalUsers,
      totalViews,
      totalBookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/stories
export const getAllStoriesAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await StoryModel.countDocuments(query);
    const stories = await StoryModel.find(query)
      .populate("author", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      stories,
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent deleting the currently logged-in admin
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all stories by this user
    await StoryModel.deleteMany({ author: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
