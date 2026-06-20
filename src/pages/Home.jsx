import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  BookOpen,
  Loader2,
} from "lucide-react";
import StoryCard from "../components/StoryCard";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { storiesAPI } from "../services/api";
import { REGION_DESCRIPTIONS } from "../constants/regions";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await storiesAPI.getAll(1, 1000);
        setStories(res.data.stories);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);
  const categories = [
    { name: "Legends", icon: Sparkles, color: "from-amber-500 to-orange-500" },
    { name: "Poetry", icon: BookOpen, color: "from-purple-500 to-pink-500" },
    {
      name: "Historical Tales",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Romantic Stories",
      icon: Sparkles,
      color: "from-rose-500 to-red-500",
    },
    {
      name: "Epic Stories",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Mythology",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
    },
  ];

  const featuredStories = stories.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,199,161,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-accent/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-text-primary leading-tight">
              Preserving the{" "}
              <span className="text-gradient">Ancient Tales</span> of
              Afghanistan
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            A digital sanctuary for Afghan folklore, where legends live on
            through the power of storytelling
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center max-w-2xl mx-auto"
          >
            <Link to="/explore" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-full">
                Explore Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-text-secondary text-sm"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-accent" />
              <span>{stories.length} Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-accent" />
              <span>7 Regions</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-accent" />
              <span>6 Categories</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                Featured Stories
              </h2>
              <p className="text-text-secondary mt-2">
                Discover our most beloved tales
              </p>
            </div>
            <Link to="/explore">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Explore Categories
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Journey through different genres of Afghan folklore
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/explore?category=${encodeURIComponent(category.name)}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="glass rounded-xl p-6 text-center space-y-4 hover:border-primary-accent/30 transition-all">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} mx-auto flex items-center justify-center`}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-text-primary font-medium group-hover:text-primary-accent transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 md:p-12 text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Share Your Story
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Help us preserve Afghan folklore by contributing your own stories
            and memories
          </p>
          <Link to={isAuthenticated ? "/add-story" : "/login"}>
            <Button size="lg">
              Add Your Story
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
