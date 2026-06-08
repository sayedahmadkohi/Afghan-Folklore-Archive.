import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin, Globe, ArrowRight, Heart, Eye } from "lucide-react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80";

const StoryCard = ({ story }) => {
  const storyId = story._id || story.id;
  const image = story.image || DEFAULT_IMAGE;
  const author = story.author?.fullName || story.author || "Unknown";
  const language = story.language || "";
  const readingTime =
    story.readingTime ||
    `${Math.max(5, Math.ceil((story.content?.length || 0) / 200))} min`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/story/${storyId}`} className="block">
        <div className="glass rounded-2xl overflow-hidden hover:border-primary-accent/30 transition-all duration-300">
          {/* Image */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img
              src={image}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-primary-accent/90 text-background text-xs font-medium backdrop-blur-sm">
                {story.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 md:p-6 space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-primary-accent transition-colors line-clamp-2">
              {story.title}
            </h3>

            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {story.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{story.region}</span>
              </div>
              {language && (
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language}</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime}</span>
              </div>
              {(story.likesCount > 0 || story.views > 0) && (
                <>
                  {story.likesCount > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{story.likesCount}</span>
                    </div>
                  )}
                  {story.views > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{story.views}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Read More */}
            <div className="flex items-center space-x-2 text-primary-accent text-sm font-medium group-hover:space-x-3 transition-all">
              <span>Read Story</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StoryCard;
