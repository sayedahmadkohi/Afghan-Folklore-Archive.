import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  MapPin,
  Edit3,
  Trash2,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminAPI, storiesAPI } from "../../services/api";
import AddStory from "../../pages/AddStory";

const AdminManageStories = ({ onEdit, editingStoryId, onClearEdit }) => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const storiesPerPage = 10;
  const debounceTimeoutRef = useRef(null);

  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getAllStories(currentPage, storiesPerPage, debouncedSearchQuery);
      setStories(res.data.stories);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, storiesPerPage, debouncedSearchQuery]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleDelete = async (storyId) => {
    try {
      await storiesAPI.delete(storyId);
      setDeleteConfirmId(null);
      fetchStories();
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPages = Math.ceil(stories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  const currentStories = stories.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // If editing a story, show the AddStory form
  if (editingStoryId) {
    return <AddStory editingStoryId={editingStoryId} onClearEdit={onClearEdit} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Hidden on mobile, shown on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 hidden lg:block"
      >
        <h1 className="text-3xl font-bold text-text-primary">Manage Stories</h1>
        <p className="text-text-secondary">View and manage all stories in the system</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search stories by title..."
            className="w-full bg-card-background border border-border rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center space-y-4"
        >
          <BookOpen className="w-16 h-16 text-text-secondary mx-auto" />
          <h3 className="text-xl font-bold text-text-primary">No Stories Found</h3>
          <p className="text-text-secondary">
            {searchQuery ? "Try a different search term" : "No stories have been added yet"}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary-accent/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-text-secondary font-medium min-w-[2rem]">
                        {startIndex + index + 1}.
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary">
                          {story.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-2">
                          <span>By {story.author?.fullName || "Unknown"}</span>
                          <span>•</span>
                          <span className="px-3 py-1 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-medium">
                            {story.category}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{story.region}</span>
                          </div>
                          <span>•</span>
                          <span>{story.language || "N/A"}</span>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between pt-4 border-t border-border"
            >
              <p className="text-text-secondary text-sm">
                Showing {startIndex + 1} to {Math.min(endIndex, stories.length)} of {stories.length} stories
              </p>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-text-primary hover:border-primary-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary-accent text-background"
                          : "bg-card-background border border-border text-text-secondary hover:text-text-primary hover:border-primary-accent"
                      }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-text-primary hover:border-primary-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminManageStories;
