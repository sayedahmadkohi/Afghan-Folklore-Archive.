import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import StoryCard from "../components/StoryCard";
import Input from "../components/Input";
import Button from "../components/Button";
import FilterChips from "../components/FilterChips";
import { storiesAPI } from "../services/api";

const Explore = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const categories = [
    "All",
    "Legends",
    "Poetry",
    "Historical Tales",
    "Romantic Stories",
    "Epic Stories",
    "Mythology",
  ];
  const regions = [
    "All",
    "Kabul",
    "Herat",
    "Balkh",
    "Bamyan",
    "Kandahar",
    "Badakhshan",
  ];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await storiesAPI.getAll();
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // Unicode-safe text normalization for multilingual search
  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .toString()
      .normalize("NFC") // Normalize Unicode composed forms
      .toLowerCase()
      .replace(/[\u200c\u200d\u200b]/g, "") // Remove zero-width characters (common in Persian/Pashto)
      .replace(/[\u0640]/g, "") // Remove Arabic tatweel (kashida)
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) {
      return stories.filter((story) => {
        const catMatch =
          selectedCategory === "All" || story.category === selectedCategory;
        const regMatch =
          selectedRegion === "All" || story.region === selectedRegion;
        return catMatch && regMatch;
      });
    }

    const normalizedQuery = normalizeText(searchQuery);

    return stories.filter((story) => {
      // Search across all relevant fields
      const searchableFields = [
        story.title,
        story.content,
        story.description,
        story.tags,
        story.region,
        story.category,
        story.language,
      ];

      const matchesSearch = searchableFields.some((field) => {
        const normalizedField = normalizeText(field);
        return normalizedField.includes(normalizedQuery);
      });

      const catMatch =
        selectedCategory === "All" || story.category === selectedCategory;
      const regMatch =
        selectedRegion === "All" || story.region === selectedRegion;
      return matchesSearch && catMatch && regMatch;
    });
  }, [stories, searchQuery, selectedCategory, selectedRegion]);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            Explore Stories
          </h1>
          <p className="text-text-secondary text-lg">
            Discover the rich tapestry of Afghan folklore
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="relative max-w-2xl">
            <Input
              icon={Search}
              placeholder="Search stories by title, description, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <FilterChips
              options={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              label="Category"
            />
            <FilterChips
              options={regions}
              selected={selectedRegion}
              onSelect={setSelectedRegion}
              label="Region"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-text-secondary">
              {filteredStories.length}{" "}
              {filteredStories.length === 1 ? "story" : "stories"} found
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primary-accent text-background"
                    : "bg-card-background border border-border text-text-secondary hover:border-primary-accent"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-primary-accent text-background"
                    : "bg-card-background border border-border text-text-secondary hover:border-primary-accent"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredStories.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredStories.map((story, index) => (
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
              <Filter className="w-16 h-16 text-text-secondary mx-auto" />
              <h3 className="text-2xl font-bold text-text-primary">
                No stories found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedRegion("All");
                }}
                variant="secondary"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
