import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Trash2,
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getAllUsers(currentPage, usersPerPage, searchQuery);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setDeleteConfirmId(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-text-primary">Manage Users</h1>
        <p className="text-text-secondary">View all registered users in the system</p>
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
            placeholder="Search users by name or email..."
            className="w-full bg-card-background border border-border rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Users List */}
      {users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center space-y-4"
        >
          <Users className="w-16 h-16 text-text-secondary mx-auto" />
          <h3 className="text-xl font-bold text-text-primary">No Users Found</h3>
          <p className="text-text-secondary">
            {searchQuery ? "Try a different search term" : "No users have registered yet"}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
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
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-text-primary">
                            {user.fullName}
                          </h3>
                          {user.role === "admin" && (
                            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-medium">
                              <Shield className="w-3 h-3" />
                              <span>Admin</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-2">
                          <span>{user.email}</span>
                          <span>•</span>
                          <span className="capitalize">{user.role || "user"}</span>
                          <span>•</span>
                          <span>
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
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
                    {user._id !== currentUser?.id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirmId(user._id)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-red-400 hover:border-red-400 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </motion.button>
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {deleteConfirmId === user._id && (
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
                            "{user.fullName}"
                          </span>
                          ? This action cannot be undone.
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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
                Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
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

export default AdminManageUsers;
