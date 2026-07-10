import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Bookmark,
  Eye,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";
import { adminAPI, storiesAPI } from "../../services/api";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-6 space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-background" />
      </div>
      <span className="text-3xl font-bold text-text-primary">{value}</span>
    </div>
    <p className="text-text-secondary font-medium">{title}</p>
  </motion.div>
);

const AdminDashboard = ({ onEdit }) => {
  const [stats, setStats] = useState({
    totalStories: 0,
    totalUsers: 0,
    totalViews: 0,
    totalBookmarks: 0,
  });
  const [latestStories, setLatestStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    const fetchLatestStories = async () => {
      try {
        const res = await adminAPI.getAllStories(1, 5);
        setLatestStories(res.data.stories);
      } catch (err) {
        console.error("Failed to fetch latest stories", err);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchLatestStories()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleDelete = async (storyId) => {
    try {
      await storiesAPI.delete(storyId);
      setDeleteConfirmId(null);
      const res = await adminAPI.getAllStories(1, 5);
      setLatestStories(res.data.stories);
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-text-primary">Administrator Dashboard</h1>
        <p className="text-text-secondary">Overview of platform statistics and activity</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stories"
          value={stats.totalStories}
          icon={BookOpen}
          color="bg-gradient-to-br from-primary-accent to-secondary-accent"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Bookmarks"
          value={stats.totalBookmarks}
          icon={Bookmark}
          color="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
      </div>

      {/* Latest Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Latest Stories</h2>
          <p className="text-text-secondary">Recently added stories to the platform</p>
        </div>

        {latestStories.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-4">
            <BookOpen className="w-16 h-16 text-text-secondary mx-auto" />
            <h3 className="text-xl font-bold text-text-primary">No Stories Yet</h3>
            <p className="text-text-secondary">
              Stories will appear here once they are added to the platform
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestStories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary-accent/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      {story.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                      <span>By {story.author?.fullName || "Unknown"}</span>
                      <span>•</span>
                      <span>
                        {new Date(story.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(story._id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirmId(story._id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-red-400 hover:border-red-400 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
                <AnimatePresence>
                  {deleteConfirmId === story._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-text-secondary text-sm">
                          Are you sure you want to delete{" "}
                          <span className="text-text-primary font-medium">
                            "{story.title}"
                          </span>
                          ?
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(story._id)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
