import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Clock,
  MapPin,
  Globe,
  Calendar,
  User,
  Plus,
  Minus,
  Sun,
  Moon,
  Loader2,
  Eye,
} from "lucide-react";
import StoryCard from "../components/StoryCard";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { storiesAPI, authAPI } from "../services/api";
import { getTextDirection } from "../utils/textDirection";

const StoryDetails = () => {
  const { id } = useParams();
  const { isDark: isDarkMode, toggleTheme: setIsDarkMode } = useTheme();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [story, setStory] = useState(null); // اطلاعات جاری داستان
  const [suggestedStories, setSuggestedStories] = useState([]); // داستان پیشنهادی
  const [loading, setLoading] = useState(true); // وضعیت بارگزاری
  const [isBookmarked, setIsBookmarked] = useState(false); //وضعیت بوک مارک
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [readingProgress, setReadingProgress] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await storiesAPI.getOne(id);
        setStory(res.data);
        setLikesCount(res.data.likesCount || 0);
        setViewsCount(res.data.views || 0);
        // Check if current user already liked this story
        if (isAuthenticated && user?.id && res.data.likedBy) {
          setIsLiked(
            res.data.likedBy.some(
              (uid) => uid.toString() === user.id.toString(),
            ),
          );
        }
        // Check if current user already saved this story
        if (isAuthenticated && user?.savedStories) {
          setIsBookmarked(user.savedStories.includes(id));
        }
        // Fetch suggested stories with relevance scoring
        const allRes = await storiesAPI.getAll();
        const others = allRes.data.stories
          .filter((s) => s._id !== res.data._id)
          .map((s) => {
            let score = 0;
            if (s.category === res.data.category) score += 3;
            if (s.language === res.data.language) score += 2;
            return { ...s, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        setSuggestedStories(others);
      } catch (err) {
        console.error("Failed to fetch story", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
    window.scrollTo(0, 0);
  }, [id, isAuthenticated, user?.id, user?.savedStories]);

  // Increment view count on story visit (with client-side anti-spam)
  useEffect(() => {
    if (!id) return;
    const viewKey = `view_${id}`;
    const lastViewTime = localStorage.getItem(viewKey);
    const COOLDOWN = 60 * 60 * 1000; // 1 hour
    if (lastViewTime && Date.now() - parseInt(lastViewTime, 10) < COOLDOWN) {
      return; // Already viewed recently
    }
    storiesAPI
      .incrementView(id)
      .then((res) => {
        setViewsCount(res.data.views);
        localStorage.setItem(viewKey, Date.now().toString());
      })
      .catch(() => {
        // Silently fail - view count is non-critical
      });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await storiesAPI.toggleLike(id);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to toggle like", err);
    } finally {
      setLikeLoading(false);
    }
  }, [id, isAuthenticated, likeLoading]);

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.description || story.title,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Failed to share", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy to clipboard", err);
      }
    }
  }, [story?.title, story?.description]);

  const handleSave = useCallback(async () => {
    if (!isAuthenticated || saveLoading) return;
    setSaveLoading(true);
    try {
      const res = await authAPI.toggleSave(id);
      setIsBookmarked(res.data.saved);
      // Sync user context savedStories array
      if (user) {
        const updatedSavedStories = res.data.saved
          ? [...(user.savedStories || []), id]
          : (user.savedStories || []).filter((storyId) => storyId !== id);
        updateUser({ ...user, savedStories: updatedSavedStories });
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    } finally {
      setSaveLoading(false);
    }
  }, [id, isAuthenticated, saveLoading, user, updateUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-accent animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Story not found</p>
      </div>
    );
  }

  const paragraphs = (story.content || "").split("\n");
  const textDirection = getTextDirection(story.language);

  const mapStoryForCard = (s) => ({
    ...s,
    id: s._id,
    image:
      s.image ||
      "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80",
    author: s.author?.fullName || s.author?.name || "Unknown",
    language: s.language || "",
    readingTime:
      s.readingTime ||
      `${Math.max(5, Math.ceil((s.content?.length || 0) / 200))} min`,
    date: s.createdAt,
  });

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div className="fixed top-16 md:top-20 left-0 right-0 h-1 bg-border z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-accent to-secondary-accent"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={
            story.image ||
            "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80"
          }
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />

        <Link
          to="/explore"
          className="absolute top-4 left-4 md:top-8 md:left-8 z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-card-background backdrop-blur-xl border border-border hover:border-primary-accent transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary" />
          </motion.button>
        </Link>
      </div>

      {/* Story Information Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-accent/90 text-background text-sm font-medium">
            {story.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight" dir={textDirection}>
            {story.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-text-secondary">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {story.author?.fullName || story.author?.name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(story.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {story.readingTime ||
                  `${Math.max(
                    5,
                    Math.ceil((story.content?.length || 0) / 200),
                  )} min`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{viewsCount} Views</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card-background border border-border">
              <MapPin className="w-4 h-4 text-primary-accent" />
              <span className="text-sm text-text-secondary">{story.region}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card-background border border-border">
              <Globe className="w-4 h-4 text-primary-accent" />
              <span className="text-sm text-text-secondary">
                {story.language}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Reading Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-card-background border border-border"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Font Size:</span>
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-2 rounded-lg bg-background-secondary border border-border hover:border-primary-accent transition-colors"
            >
              <Minus className="w-4 h-4 text-text-primary" />
            </button>
            <span className="w-8 text-center text-text-primary">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-2 rounded-lg bg-background-secondary border border-border hover:border-primary-accent transition-colors"
            >
              <Plus className="w-4 h-4 text-text-primary" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12" dir={textDirection}>
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-gray"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.8" }}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 text-text-primary">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Story Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12 pt-8 border-t border-border"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            disabled={!isAuthenticated || likeLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              isLiked
                ? "bg-red-500/20 text-red-500 border border-red-500"
                : "bg-card-background border border-border text-text-secondary hover:border-primary-accent"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>
              {isLiked ? "Liked" : "Like"}
              {likesCount > 0 ? ` (${likesCount})` : ""}
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!isAuthenticated || saveLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              isBookmarked
                ? "bg-primary-accent/20 text-primary-accent border border-primary-accent"
                : "bg-card-background border border-border text-text-secondary hover:border-primary-accent"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
            />
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-card-background border border-border text-text-secondary hover:border-primary-accent transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Suggested Stories */}
      {suggestedStories.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-text-secondary">
              Suggested Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestedStories.map((suggestedStory) => (
                <StoryCard
                  key={suggestedStory._id}
                  story={mapStoryForCard(suggestedStory)}
                  compact
                />
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default StoryDetails;
