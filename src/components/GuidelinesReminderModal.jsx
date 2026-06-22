import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Info, X, Globe, Check } from "lucide-react";
import Button from "./Button";

// Translation data
const translations = {
  English: {
    title: "Community Guidelines Reminder",
    message: "Please remember to follow our community guidelines when submitting your story.",
    viewFull: "View Full Guidelines",
    continue: "Continue to Add Story",
  },
  فارسی: {
    title: "یادآوری راهنمای جامعه",
    message: "لطفاً هنگام ارسال داستان خود، از راهنمای جامعه ما پیروی کنید.",
    viewFull: "مشاهده راهنمای کامل",
    continue: "ادامه به افزودن داستان",
  },
  پشتو: {
    title: "د ټولنیز لارښوونې یادښت",
    message: "مهرباني وکړئ د خپل کیسې په سپارښت کې د ټولنیز لارښوونو پیروی وکړئ.",
    viewFull: "د بشپړو لارښوونو لیدل",
    continue: "د کیسې اضافولو ته دوام ورکړئ",
  },
};

const GuidelinesReminderModal = ({ onContinue, onViewFull, onCancel }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const currentTranslation = translations[selectedLanguage];

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
          className="relative z-10 w-full max-w-md rounded-2xl p-6 md:p-8 shadow-xl bg-card-background border border-border dark:border-border/50"
        >
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-background-secondary border border-border dark:border-border/50"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 rounded-lg p-1 bg-background-secondary border border-border dark:border-border/50"
            >
              {["English", "فارسی", "پشتو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
                    selectedLanguage === lang
                      ? "bg-primary-accent text-background"
                      : "text-text-secondary hover:text-text-primary hover:bg-background/50"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center mx-auto mb-4"
            >
              <Info className="w-7 h-7 text-background" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-bold text-text-primary">
              {currentTranslation.title}
            </h2>
            <p className="text-text-secondary mt-2 text-sm">
              {currentTranslation.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={onViewFull}
              className="flex-1"
            >
              {currentTranslation.viewFull}
            </Button>
            <Button onClick={onContinue} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              {currentTranslation.continue}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidelinesReminderModal;
