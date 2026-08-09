import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  MapPin,
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { storiesAPI } from "../../services/api";

const MyStories = ({ onEdit }) => {
  const [myStories, setMyStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 5;

  const fetchMyStories = async () => {
    try {
      setIsLoading(true);
      const res = await storiesAPI.getMy();
      setMyStories(res.data);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStories();
  }, []);

  const handleDelete = async (storyId) => {
    try {
      await storiesAPI.delete(storyId);
      setDeleteConfirmId(null);
      setCurrentPage(1);
      fetchMyStories();
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };

  const totalPages = Math.ceil(myStories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  const currentStories = myStories.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-text-primary">My Stories</h1>
        <p className="text-text-secondary">
          Manage and edit your contributed stories
        </p>
      </motion.div>

      {/* Stories List */}
      {myStories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center space-y-4"
        >
          <FileText className="w-16 h-16 text-text-secondary mx-auto" />
          <h3 className="text-xl font-bold text-text-primary">No Stories Yet</h3>
          <p className="text-text-secondary">
            Navigate to Add Story to submit your first story
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {currentStories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary-accent/30 transition-colors"
              >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-base md:text-lg font-bold text-text-primary">
                    {startIndex + index + 1}. {story.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-text-secondary">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary-accent/10 text-primary-accent text-[10px] md:text-xs font-medium">
                      {story.category}
                    </span>
                    {story.status === "pending" && (
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] md:text-xs font-medium">
                        Pending Review
                      </span>
                    )}
                    {story.status === "rejected" && (
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] md:text-xs font-medium">
                        Rejected
                      </span>
                    )}
                    <div className="flex items-center space-x-1 md:space-x-1.5">
                      <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      <span>{story.region}</span>
                    </div>
                    <span className="hidden sm:inline text-xs">
                      {new Date(story.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {story.status === "rejected" && (
                    <p className="text-xs text-red-400 mt-2">
                      Edit and resubmit this story for another review.
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
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
              Showing {startIndex + 1} to {Math.min(endIndex, myStories.length)} of {myStories.length} stories
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

export default MyStories;
