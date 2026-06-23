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
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0 shadow-xl bg-background-secondary border border-border/20 dark:bg-card-background dark:border-border/30 scrollbar-minimal backdrop-blur-xl"
          >
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-accent/5 via-transparent to-secondary-accent/5 pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl border border-border/30 dark:border-border/40 pointer-events-none" />
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl transition-all hover:bg-background-secondary/80 border border-border/30 dark:border-border/40 hover:border-border/50"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>

          {/* Language Selector */}
          <div className="flex justify-center pt-5 pb-4 px-5">
            <div className="inline-flex items-center space-x-1 rounded-2xl p-1 bg-background-secondary/50 border border-border/30 dark:border-border/40 backdrop-blur-sm"
            >
              {["English", "فارسی", "پشتو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                    selectedLanguage === lang
                      ? "bg-gradient-to-r from-primary-accent to-secondary-accent text-background shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-background/40"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 px-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-accent/15"
            >
              <Info className="w-7 h-7 text-primary-accent" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
              {currentTranslation.title}
            </h2>
            <p className="text-text-secondary mt-3 text-sm leading-relaxed">
              {currentTranslation.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 px-5 pb-6">
            <Button
              variant="secondary"
              onClick={onViewFull}
              className="w-full h-11 text-sm"
            >
              {currentTranslation.viewFull}
            </Button>
            <Button onClick={onContinue} className="w-full h-11 text-sm bg-gradient-to-r from-primary-accent to-secondary-accent hover:from-primary-accent/90 hover:to-secondary-accent/90 shadow-md shadow-primary-accent/20">
              <Check className="w-4 h-4 mr-2" />
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
