import { createPortal } from "react-dom";
import { motion } from "framer-motion";
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

const GuidelinesReminderModal = ({ onContinue, onViewFull, onCancel, selectedLanguage, onLanguageChange }) => {
  const currentTranslation = translations[selectedLanguage];

  return createPortal(
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] overflow-y-auto"
      >
        {/* Center Wrapper */}
        <div className="min-h-screen flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-5 md:p-6 shadow-lg bg-card-background border border-border dark:border-border/50 scrollbar-minimal"
          >
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-background-secondary border border-border dark:border-border/50"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Language Selector */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center space-x-1.5 rounded-md p-0.5 bg-background-secondary/50 border border-border dark:border-border/30"
            >
              {["English", "فارسی", "پشتو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-sm transition-all ${
                    selectedLanguage === lang
                      ? "bg-primary-accent text-background"
                      : "text-text-secondary hover:text-text-primary hover:bg-background/30"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span className="text-xs font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-12 h-12 rounded-full bg-primary-accent/10 flex items-center justify-center mx-auto mb-3"
            >
              <Info className="w-5 h-5 text-primary-accent" />
            </motion.div>
            <h2 className="text-lg md:text-xl font-semibold text-text-primary">
              {currentTranslation.title}
            </h2>
            <p className="text-text-secondary mt-1.5 text-xs">
              {currentTranslation.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={onViewFull}
              className="flex-1 text-sm"
            >
              {currentTranslation.viewFull}
            </Button>
            <Button onClick={onContinue} className="flex-1 text-sm">
              <Check className="w-3.5 h-3.5 mr-1.5" />
              {currentTranslation.continue}
            </Button>
          </div>
        </motion.div>
        </div>
      </motion.div>
    ,
    document.body
  );
};

export default GuidelinesReminderModal;
