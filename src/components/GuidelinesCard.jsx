import { motion } from "framer-motion";
import { Scroll, Shield, CheckCircle2 } from "lucide-react";

const GuidelinesCard = () => {
  const guidelines = [
    {
      icon: CheckCircle2,
      text: "Respect cultural heritage",
    },
    {
      icon: CheckCircle2,
      text: "Share meaningful folklore stories",
    },
    {
      icon: CheckCircle2,
      text: "Keep stories appropriate and authentic",
    },
    {
      icon: CheckCircle2,
      text: "Avoid offensive or harmful content",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative rounded-3xl overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-card-background backdrop-blur-xl" />
        
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-accent/10 via-transparent to-secondary-accent/10 pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl border border-border/30 dark:border-border/40 pointer-events-none" />
        
        {/* Content */}
        <div className="relative p-8 md:p-10">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 flex items-center justify-center shadow-lg shadow-primary-accent/10"
            >
              <Scroll className="w-7 h-7 text-primary-accent" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Storytelling Guidelines
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                Share authentic Afghan folklore while honoring our rich cultural traditions. 
                Your stories help preserve the spirit of our oral heritage for future generations.
              </p>
            </div>
          </div>

          {/* Guidelines List */}
          <div className="space-y-3 mb-6">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-xl bg-background-secondary/40 border border-border/20 dark:border-border/30 hover:bg-background-secondary/60 transition-all group"
              >
                <guideline.icon className="w-5 h-5 text-primary-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-text-primary text-sm md:text-base">{guideline.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Reminder Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative p-4 rounded-2xl bg-gradient-to-r from-primary-accent/10 to-secondary-accent/10 border border-primary-accent/20 dark:border-primary-accent/30"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-accent/20 flex items-center justify-center"
              >
                <Shield className="w-4 h-4 text-primary-accent" />
              </motion.div>
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium mb-1">
                  Review Process
                </p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  All stories are reviewed to ensure they preserve the authentic spirit of Afghan oral traditions 
                  and cultural heritage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GuidelinesCard;
