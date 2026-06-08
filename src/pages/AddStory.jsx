import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  MapPin,
  Tag,
  Globe,
  Image,
  FileText,
  Send,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Button from "../components/Button";
import CommunityRulesModal from "../components/CommunityRulesModal";
import { useAuth } from "../context/AuthContext";
import { storiesAPI, authAPI } from "../services/api";

const MAX_CONTENT_LENGTH = 50000;

const categories = [
  "Legends",
  "Poetry",
  "Historical Tales",
  "Romantic Stories",
  "Epic Stories",
  "Mythology",
];
const regions = ["Kabul", "Herat", "Balkh", "Bamyan", "Kandahar", "Badakhshan"];
const languages = ["Dari", "Pashto", "Uzbek", "Arabic", "English"];

const emptyForm = {
  title: "",
  region: "",
  category: "",
  language: "",
  tags: "",
  coverImage: "",
  content: "",
};

const AddStory = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has accepted rules
  useEffect(() => {
    if (user && !user.acceptedRules) {
      setShowRulesModal(true);
    }
  }, [user]);

  // Load user's stories from API
  const fetchMyStories = async () => {
    try {
      const res = await storiesAPI.getMy();
      setMyStories(res.data);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyStories();
    }
  }, [user]);

  const handleAcceptRules = async () => {
    try {
      await authAPI.acceptRules();
      const updatedUser = { ...user, acceptedRules: true };
      updateUser(updatedUser);
      setShowRulesModal(false);
    } catch (err) {
      setError("Failed to accept rules. Please try again.");
    }
  };

  const handleCancelRules = () => {
    navigate("/");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    if (!formData.title.trim()) return "Story title is required";
    if (!formData.region) return "Please select a region";
    if (!formData.category) return "Please select a category";
    if (!formData.language) return "Please select a language";
    if (!formData.content.trim()) return "Story content is required";
    if (formData.content.trim().length < 50)
      return "Story content must be at least 50 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("region", formData.region);
      data.append("category", formData.category);
      data.append("tags", formData.tags.trim());
      data.append("language", formData.language);
      data.append("content", formData.content.trim());
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingId) {
        await storiesAPI.update(editingId, data);
        setSuccess("Story updated successfully!");
        setEditingId(null);
      } else {
        await storiesAPI.create(data);
        setSuccess("Story submitted successfully!");
      }

      setFormData(emptyForm);
      setCoverPreview("");
      setImageFile(null);
      fetchMyStories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to save story. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (story) => {
    setFormData({
      title: story.title,
      region: story.region,
      category: story.category,
      language: story.language || "",
      tags: story.tags || "",
      coverImage: story.image || "",
      content: story.content,
    });
    // If story has an image, show it as preview (prepend API base if relative)
    if (story.image) {
      setCoverPreview(story.image.startsWith("/") ? story.image : story.image);
    } else {
      setCoverPreview("");
    }
    setEditingId(story._id);
    setImageFile(null);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (storyId) => {
    try {
      await storiesAPI.delete(storyId);
      setDeleteConfirmId(null);
      fetchMyStories();
      if (editingId === storyId) {
        setFormData(emptyForm);
        setCoverPreview("");
        setEditingId(null);
        setImageFile(null);
      }
    } catch (err) {
      setError("Failed to delete story. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    setCoverPreview("");
    setEditingId(null);
    setImageFile(null);
    setError("");
    setSuccess("");
  };

  const contentLength = formData.content.length;
  const contentPercentage = Math.min(
    (contentLength / MAX_CONTENT_LENGTH) * 100,
    100,
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Community Rules Modal */}
      {showRulesModal && (
        <CommunityRulesModal
          onAccept={handleAcceptRules}
          onCancel={handleCancelRules}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            {editingId ? "Edit Story" : "Add New Story"}
          </h1>
          <p className="text-text-secondary text-lg">
            {editingId
              ? "Update your story details below"
              : "Share a piece of Afghan heritage with the world"}
          </p>
        </motion.div>

        {/* Story Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Story Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Story Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <BookOpen className="w-5 h-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter the title of your story"
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 pl-12 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Region & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Region <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-text-secondary" />
                  </div>
                  <select
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    className="w-full bg-card-background border border-border rounded-lg px-4 py-3 pl-12 text-text-primary focus:outline-none focus:border-primary-accent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background-secondary">
                      Select a region
                    </option>
                    {regions.map((r) => (
                      <option
                        key={r}
                        value={r}
                        className="bg-background-secondary"
                      >
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Tag className="w-5 h-5 text-text-secondary" />
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full bg-card-background border border-border rounded-lg px-4 py-3 pl-12 text-text-primary focus:outline-none focus:border-primary-accent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background-secondary">
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="bg-background-secondary"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Language <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Globe className="w-5 h-5 text-text-secondary" />
                </div>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 pl-12 text-text-primary focus:outline-none focus:border-primary-accent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-background-secondary">
                    Select a language
                  </option>
                  {languages.map((l) => (
                    <option
                      key={l}
                      value={l}
                      className="bg-background-secondary"
                    >
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Tags
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Tag className="w-5 h-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="e.g. mythology, hero, love (comma-separated)"
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 pl-12 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Cover Image
              </label>
              <div className="relative">
                {coverPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-48 md:h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPreview("");
                        setImageFile(null);
                        setFormData((prev) => ({ ...prev, coverImage: "" }));
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-red-400 transition-colors"
                    >
                      <X className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-accent transition-colors bg-card-background">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Image className="w-10 h-10 text-text-secondary" />
                      <p className="text-text-secondary text-sm">
                        <span className="text-primary-accent font-medium">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-text-secondary text-xs">
                        PNG, JPG, WEBP (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-secondary">
                  Story Content <span className="text-red-400">*</span>
                </label>
                <span
                  className={`text-xs ${
                    contentPercentage > 90
                      ? "text-red-400"
                      : "text-text-secondary"
                  }`}
                >
                  {contentLength.toLocaleString()} /{" "}
                  {MAX_CONTENT_LENGTH.toLocaleString()}
                </span>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Write your story here... Let the words carry the spirit of Afghan heritage."
                rows={12}
                maxLength={MAX_CONTENT_LENGTH}
                className="w-full bg-card-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300 resize-y min-h-[300px] leading-relaxed"
              />
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    contentPercentage > 90
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-primary-accent to-secondary-accent"
                  }`}
                  style={{ width: `${contentPercentage}%` }}
                />
              </div>
            </div>

            {/* Submit / Cancel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                {editingId ? (
                  <>
                    <Edit3 className="w-5 h-5 mr-2" />
                    Update Story
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Story
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* My Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              My Stories
            </h2>
            <span className="text-text-secondary text-sm">
              {myStories.length} {myStories.length === 1 ? "story" : "stories"}
            </span>
          </div>

          {myStories.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center space-y-4">
              <FileText className="w-16 h-16 text-text-secondary mx-auto" />
              <h3 className="text-xl font-bold text-text-primary">
                No Stories Yet
              </h3>
              <p className="text-text-secondary">
                Submit your first story using the form above to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myStories.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-5 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-text-primary">
                        {story.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                        <span className="px-3 py-1 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-medium">
                          {story.category}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{story.region}</span>
                        </div>
                        <span className="text-xs">
                          {new Date(story.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(story)}
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
    </div>
  );
};

export default AddStory;
