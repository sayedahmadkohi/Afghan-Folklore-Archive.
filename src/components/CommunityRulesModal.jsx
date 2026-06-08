import { motion, AnimatePresence } from "framer-motion";
import { Shield, Heart, Ban, BookOpen, AlertTriangle, X } from "lucide-react";
import Button from "./Button";

const CommunityRulesModal = ({ onAccept, onCancel }) => {
  const rules = [
    {
      icon: Heart,
      title: "Respect Afghan Cultural Heritage",
      description:
        "Honor the traditions, customs, and cultural significance of Afghan folklore in all submissions.",
    },
    {
      icon: Ban,
      title: "No Hate Speech",
      description:
        "Any form of hate speech, discrimination, or prejudice will not be tolerated.",
    },
    {
      icon: Shield,
      title: "No Offensive Content",
      description:
        "Do not submit content that is offensive, inappropriate, or disrespectful to any group.",
    },
    {
      icon: AlertTriangle,
      title: "No Fabricated Historical Claims",
      description:
        "Do not present fabricated stories as historical facts. Clearly distinguish between folklore and history.",
    },
    {
      icon: BookOpen,
      title: "Submit Authentic Folklore",
      description:
        "Whenever possible, submit stories that are authentic and rooted in Afghan oral traditions.",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-2xl glass rounded-2xl p-6 md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-lg bg-card-background border border-border hover:border-primary-accent transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-background" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Community Guidelines
            </h2>
            <p className="text-text-secondary mt-2">
              Please read and accept our community rules before contributing
            </p>
          </div>

          {/* Rules */}
          <div className="space-y-4 mb-8">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-background-secondary border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-accent/10 flex items-center justify-center flex-shrink-0">
                  <rule.icon className="w-5 h-5 text-primary-accent" />
                </div>
                <div>
                  <h3 className="text-text-primary font-semibold mb-1">
                    {rule.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onAccept} className="flex-1">
              Accept Rules
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityRulesModal;
