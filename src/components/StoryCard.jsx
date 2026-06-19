// کامپونیت کارت داستان هست.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin, Globe, ArrowRight, Heart, Eye } from "lucide-react";
// عکس پیش فرض
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80";

const StoryCard = ({ story, compact = false }) => {
  const storyId = story._id || story.id;
  const image = story.image || DEFAULT_IMAGE;
  const author = story.author?.fullName || story.author || "Unknown";
  const language = story.language || "";
  const readingTime =
    story.readingTime ||
    `${Math.max(5, Math.ceil((story.content?.length || 0) / 200))} min`;

  // ساختار اصلی کارت ها
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: compact ? -4 : -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/story/${storyId}`} className="block">
        <div className={`glass rounded-2xl overflow-hidden hover:border-primary-accent/30 transition-all duration-300 ${compact ? 'rounded-xl' : ''}`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${compact ? 'h-28' : 'h-48 md:h-64'}`}>
            <img
              src={image}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-0.5 rounded-full bg-primary-accent/90 text-background font-medium backdrop-blur-sm ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {story.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-2 ${compact ? 'p-3' : 'p-5 md:p-6 space-y-4'}`}>
            <h3 className={`font-bold text-text-primary group-hover:text-primary-accent transition-colors line-clamp-2 ${compact ? 'text-sm' : 'text-xl md:text-2xl'}`}>
              {story.title}
            </h3>

            {!compact && (
              <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
                {story.description}
              </p>
            )}

            {/* Metadata */}
            <div className={`flex flex-wrap items-center gap-2 text-text-secondary ${compact ? 'text-[10px]' : 'text-xs gap-3'}`}>
              <div className="flex items-center space-x-1">
                <MapPin className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                <span>{story.region}</span>
              </div>
              {language && (
                <div className="flex items-center space-x-1">
                  <Globe className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                  <span>{language}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Read More */}
            {!compact && (
              <div className="flex items-center space-x-2 text-primary-accent text-sm font-medium group-hover:space-x-3 transition-all">
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StoryCard;
