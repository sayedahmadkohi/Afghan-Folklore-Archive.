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
  Check,
  X,
} from "lucide-react";
import { adminAPI, storiesAPI } from "../../services/api";
import AddStory from "../../pages/AddStory";

const AdminManageStories = ({ onEdit, editingStoryId, onClearEdit }) => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const storiesPerPage = 10;
  const debounceTimeoutRef = useRef(null);

  const fetchStories = useCallback(async () => {
    try {
      setIsLoading(true);
      // Convert "All" to empty string for backend, keep other values as-is
      const statusParam = statusFilter === "All" ? "" : statusFilter.toLowerCase();
      const res = await adminAPI.getAllStories(currentPage, storiesPerPage, debouncedSearchQuery, statusParam);
      setStories(res.data.stories);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, storiesPerPage, debouncedSearchQuery, statusFilter]);

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

  const handleApprove = async (storyId) => {
    try {
      await storiesAPI.approve(storyId);
      fetchStories();
    } catch (err) {
      console.error("Failed to approve story", err);
    }
  };

  const handleReject = async (storyId) => {
    try {
      await storiesAPI.reject(storyId);
      fetchStories();
    } catch (err) {
      console.error("Failed to reject story", err);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + stories.length;

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

      {/* Status Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilterChange(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-primary-accent text-background"
                : "bg-card-background border border-border text-text-secondary hover:text-text-primary hover:border-primary-accent"
            }`}
          >
            {status}
          </button>
        ))}
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
                        <h3 className="text-base md:text-lg font-bold text-text-primary">
                          {story.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-text-secondary mt-2">
                          <span>By {story.author?.fullName || "Unknown"}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary-accent/10 text-primary-accent text-[10px] md:text-xs font-medium">
                            {story.category}
                          </span>
                          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                            story.status === "pending" ? "bg-green-500/10 text-green-400" :
                            story.status === "approved" ? "bg-blue-500/10 text-blue-400" :
                            story.status === "rejected" ? "bg-red-500/10 text-red-400" :
                            "bg-gray-500/10 text-gray-400"
                          }`}>
                            {story.status || "Unknown"}
                          </span>
                          <div className="flex items-center space-x-1 md:space-x-1.5">
                            <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5" />
                            <span>{story.region}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{story.language || "N/A"}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
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
                    {story.status === "pending" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(story._id)}
                          className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-xs md:text-sm"
                        >
                          <Check className="w-3.5 md:w-4 h-3.5 md:h-4" />
                          <span>Accept</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(story._id)}
                          className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs md:text-sm"
                        >
                          <X className="w-3.5 md:w-4 h-3.5 md:h-4" />
                          <span>Reject</span>
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(story._id)}
                      className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors text-xs md:text-sm"
                    >
                      <Edit3 className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirmId(story._id)}
                      className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-red-400 hover:border-red-400 transition-colors text-xs md:text-sm"
                    >
                      <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
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
                Showing {startIndex + 1} to {endIndex} of {totalItems} stories
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
