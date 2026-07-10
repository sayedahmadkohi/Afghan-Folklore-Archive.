import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, Loader2 } from "lucide-react";
import StoryCard from "../components/StoryCard";
import { authAPI } from "../services/api";

const SavedStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedStories = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getSavedStories();
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch saved stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedStories();
  }, []);

  // Transform API story data for StoryCard compatibility
  const mapStoryForCard = (story) => ({
    ...story,
    id: story._id,
    image:
      story.image ||
      "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80",
    author: story.author?.fullName || story.author?.name || "Unknown",
    language: story.language || "",
    readingTime:
      story.readingTime ||
      `${Math.max(5, Math.ceil((story.content?.length || 0) / 200))} min`,
    date: story.createdAt,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Hidden on mobile when in admin dashboard, shown on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            Saved Stories
          </h1>
          <p className="text-text-secondary text-lg">
            Your personal collection of favorite folklore
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {stories.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <StoryCard story={mapStoryForCard(story)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <Bookmark className="w-16 h-16 text-text-secondary mx-auto" />
              <h3 className="text-2xl font-bold text-text-primary">
                No saved stories yet
              </h3>
              <p className="text-text-secondary">
                Start exploring and save your favorite stories to build your
                collection
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedStories;
