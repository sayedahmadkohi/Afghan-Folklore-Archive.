import StoryModel from "../models/Story.js";
import jwt from "jsonwebtoken";

// GET /api/stories
export const getStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const category = req.query.category || "";
    const language = req.query.language || "";

    // Build base query for category and language filters
    const baseQuery = { status: "approved" };

    // Add category filter
    if (category && category !== "All") {
      baseQuery.category = category;
    }

    // Add language filter
    if (language && language !== "All") {
      baseQuery.language = language;
    }

    let stories;
    let totalItems;

    if (search) {
      // Search with ranking
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const startsWithRegex = new RegExp(`^${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

      // Build search query (title, description, tags - NOT content)
      const searchQuery = {
        ...baseQuery,
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } },
        ],
      };

      // Get all matching stories for ranking
      const allMatchingStories = await StoryModel.find(searchQuery)
        .populate("author", "fullName email");

      // Calculate relevance scores
      const scoredStories = allMatchingStories.map(story => {
        let score = 0;
        const title = (story.title || "").toLowerCase();
        const description = (story.description || "").toLowerCase();
        const tags = (story.tags || "").toLowerCase();
        const searchLower = search.toLowerCase();

        // Priority 1: Title starts with search (highest)
        if (startsWithRegex.test(story.title || "")) {
          score += 100;
        }
        // Priority 2: Title contains search
        else if (title.includes(searchLower)) {
          score += 50;
        }
        // Priority 3: Description contains search
        if (description.includes(searchLower)) {
          score += 25;
        }
        // Priority 4: Tags contain search
        if (tags.includes(searchLower)) {
          score += 10;
        }

        return { ...story.toObject(), _searchScore: score };
      });

      // Sort by score (descending), then by createdAt (descending)
      scoredStories.sort((a, b) => {
        if (b._searchScore !== a._searchScore) {
          return b._searchScore - a._searchScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Remove the score field before returning
      const sortedStories = scoredStories.map(({ _searchScore, ...story }) => story);

      totalItems = sortedStories.length;
      stories = sortedStories.slice(skip, skip + limit);
    } else {
      // No search - just apply filters
      totalItems = await StoryModel.countDocuments(baseQuery);
      stories = await StoryModel.find(baseQuery)
        .populate("author", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

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

// GET /api/stories/my
export const getMyStories = async (req, res, next) => {
  try {
    const stories = await StoryModel.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(stories);
  } catch (error) {
    next(error);
  }
};

// GET /api/stories/:id
export const getStory = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id).populate(
      "author",
      "fullName email",
    );
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    next(error);
  }
};

// POST /api/stories
export const createStory = async (req, res, next) => {
  try {
    const {
      title,
      category,
      region,
      tags,
      content,
      description,
      language,
      readingTime,
    } = req.body;

    const storyData = {
      title,
      category,
      region,
      tags: tags || "",
      content,
      description: description || "",
      language: language || undefined,
      readingTime: readingTime || "",
      author: req.user._id,
    };

    if (req.file) {
      storyData.image = `/uploads/stories/${req.file.filename}`;
    }

    const story = await StoryModel.create(storyData);
    await story.populate("author", "fullName email");
    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
};

// PUT /api/stories/:id
export const updateStory = async (req, res, next) => {
  try {
    let story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check ownership or admin role
    if (story.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this story" });
    }

    const {
      title,
      category,
      region,
      tags,
      content,
      description,
      language,
      readingTime,
    } = req.body;

    story.title = title || story.title;
    story.category = category || story.category;
    story.region = region || story.region;
    story.tags = tags !== undefined ? tags : story.tags;
    story.content = content || story.content;
    story.description =
      description !== undefined ? description : story.description;
    story.language = language !== undefined ? language : story.language;
    story.readingTime =
      readingTime !== undefined ? readingTime : story.readingTime;

    if (req.file) {
      story.image = `/uploads/stories/${req.file.filename}`;
    }

    await story.save();
    await story.populate("author", "fullName email");
    res.json(story);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/stories/:id
export const deleteStory = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check ownership or admin role
    if (story.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this story" });
    }

    await story.deleteOne();
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/stories/:id/like - Toggle like
export const toggleLike = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = story.likedBy.includes(userId);

    if (alreadyLiked) {
      story.likedBy = story.likedBy.filter(
        (id) => id.toString() !== userId.toString(),
      );
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      story.likedBy.push(userId);
      story.likesCount += 1;
    }

    await story.save();
    await story.populate("author", "fullName email");

    res.json({
      liked: !alreadyLiked,
      likesCount: story.likesCount,
      story,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/stories/:id/view - Increment view count
export const incrementView = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Anti-spam: use a fingerprint from user token, IP, or anonymous
    let fingerprint;
    try {
      // Try to extract user ID from optional auth header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        fingerprint = decoded.id?.toString();
      }
    } catch {
      // Token invalid or missing, use IP
    }
    fingerprint =
      fingerprint || req.ip || req.connection?.remoteAddress || "anon";
    const viewKey = `view_${story._id}_${fingerprint}`;

    // Simple in-memory rate limiting (resets on server restart, which is acceptable)
    if (!global._viewThrottle) global._viewThrottle = new Map();
    const lastView = global._viewThrottle.get(viewKey);
    const COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown per user per story

    if (lastView && Date.now() - lastView < COOLDOWN) {
      return res.json({ views: story.views, incremented: false });
    }

    story.views += 1;
    await story.save();

    global._viewThrottle.set(viewKey, Date.now());

    res.json({ views: story.views, incremented: true });
  } catch (error) {
    next(error);
  }
};

// PUT /api/stories/:id/approve - Approve a story (admin only)
export const approveStory = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.status = "approved";
    await story.save();
    await story.populate("author", "fullName email");

    res.json(story);
  } catch (error) {
    next(error);
  }
};

// PUT /api/stories/:id/reject - Reject a story (admin only)
export const rejectStory = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.status = "rejected";
    await story.save();
    await story.populate("author", "fullName email");

    res.json(story);
  } catch (error) {
    next(error);
  }
};
