import { motion } from "framer-motion";
import { BookOpen, Sparkles, Globe, Heart, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent mx-auto flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            About Afghan Folklore Archive
          </h1>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 mb-8"
        >
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed text-center">
            Afghan Folklore Archive is a digital platform dedicated to preserving,
            exploring, and sharing the rich oral traditions, stories, legends,
            poetry, and cultural heritage of Afghanistan.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-text-primary">Our Mission</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Our mission is to create a modern archive where Afghan stories from
            different regions, languages, and traditions can be documented and
            discovered for future generations.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-text-primary">Features</h2>
          </div>
          <ul className="space-y-4 text-text-secondary">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-accent mt-2 flex-shrink-0" />
              <span>Explore folklore stories by category and region</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-accent mt-2 flex-shrink-0" />
              <span>Share and preserve traditional stories</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-accent mt-2 flex-shrink-0" />
              <span>Support multiple languages</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-accent mt-2 flex-shrink-0" />
              <span>Provide a modern reading experience</span>
            </li>
          </ul>
        </motion.div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-text-primary">Future Vision</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            We aim to continue improving the platform with more languages, better
            discovery tools, community features, and stronger cultural preservation.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <Heart className="w-4 h-4 text-primary-accent" />
            <span className="text-sm">Preserving culture, one story at a time</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
