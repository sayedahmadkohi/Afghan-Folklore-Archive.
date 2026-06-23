// قوانین انجمن را در اینجا میسازه
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Shield, Heart, Ban, BookOpen, AlertTriangle, X, Globe } from "lucide-react";
import Button from "./Button";

// Translation data
const translations = {
  English: {
    title: "Community Guidelines",
    description: "Please read and accept our community rules before contributing",
    rules: [
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
    ],
    cancel: "Cancel",
    accept: "Accept Rules",
  },
  فارسی: {
    title: "راهنمای جامعه",
    description: "لطفاً قبل از مشارکت، قوانین جامعه ما را مطالعه کرده و بپذیرید",
    rules: [
      {
        icon: Heart,
        title: "احترام به میراث فرهنگی افغانستان",
        description:
          "در تمام ارسال‌ها، به سنت‌ها، آداب و رسوم و اهمیت فرهنگی افسانه‌های افغان احترام بگذارید.",
      },
      {
        icon: Ban,
        title: "بدون سخنان نفرت‌آمیز",
        description:
          "هرگونه سخنرانی نفرت‌آمیز، تبعیض یا تعصب تحمل نخواهد شد.",
      },
      {
        icon: Shield,
        title: "بدون محتوای توهین‌آمیز",
        description:
          "محتوایی که توهین‌آمیز، نامناسب یا بی‌احترامی به هر گروهی باشد، ارسال نکنید.",
      },
      {
        icon: AlertTriangle,
        title: "بدون ادعاهای تاریخی جعلی",
        description:
          "داستان‌های جعلی را به عنوان حقایق تاریخی ارائه ندهید. بین افسانه و تاریخ به وضوح تمایز قائل شوید.",
      },
      {
        icon: BookOpen,
        title: "ارسال افسانه‌های اصیل",
        description:
          "هر زمان که ممکن است، داستان‌هایی ارسال کنید که اصیل باشند و در سنت‌های شفاهی افغان ریشه دارند.",
      },
    ],
    cancel: "لغو",
    accept: "پذیرش قوانین",
  },
  پشتو: {
    title: "د ټولنیز لارښوونې",
    description: "د مرستې وړخوا لپاره د ټولنیز قوانین مو لوستل او منل غواړو",
    rules: [
      {
        icon: Heart,
        title: "د افغانستان کلتوري میراث ته درناوی",
        description:
          "په ټولو سپارښتنو کې د افغان افسانو د سنتونو، دودونو او کلتوري اهمیت ته درناوی وکړئ.",
      },
      {
        icon: Ban,
        title: "بې کرکه وینې",
        description:
          "د کرکې وینې، تبعیض یا تعصب هر ډول بڼه به نه منل کیږي.",
      },
      {
        icon: Shield,
        title: "بې توهینونکې منځپانګې",
        description:
          "هغه منځپانګې چې توهینونکې، نامناسب یا د هر ډول ډلې څخه بې درناوی وي، مه ورکړئ.",
      },
      {
        icon: AlertTriangle,
        title: "بې جعلي تاریخي ادعاګانو",
        description:
          "جعلي کیسې د تاریخي حقایقو په توګه وړاندې نه کړئ. د افسانه او تاریخ ترمنځ روښانه توپیر ورکړئ.",
      },
      {
        icon: BookOpen,
        title: "اصيل افسانې سپارل",
        description:
          "هر څه چې ممکن وي، هغه کیسې سپارښت کړئ چې اصیل وي او په افغان شفاهي سنتونو کې ریشه لري.",
      },
    ],
    cancel: "لغول",
    accept: "قوانین منل",
  },
};

// تعریف قوانین
const CommunityRulesModal = ({ onAccept, onCancel, selectedLanguage, onLanguageChange }) => {
  const currentTranslation = translations[selectedLanguage];
  // ساختار اصلی مودال
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
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 shadow-2xl bg-background-secondary border border-border/20 dark:bg-card-background dark:border-border/30 scrollbar-minimal backdrop-blur-xl"
          >
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-accent/5 via-transparent to-secondary-accent/5 pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl border border-border/30 dark:border-border/40 pointer-events-none" />
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-xl transition-all hover:bg-background-secondary/80 border border-border/30 dark:border-border/40 hover:border-border/50"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Language Selector */}
          <div className="flex justify-center pt-6 pb-4 px-6">
            <div className="inline-flex items-center space-x-1.5 rounded-2xl p-1 bg-background-secondary/60 border border-border/30 dark:border-border/40 backdrop-blur-sm"
            >
              {["English", "فارسی", "پشتو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    selectedLanguage === lang
                      ? "bg-gradient-to-r from-primary-accent to-secondary-accent text-background shadow-md"
                      : "text-text-secondary hover:text-text-primary hover:bg-background/40"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-accent via-primary-accent/90 to-secondary-accent flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-accent/25"
            >
              <Shield className="w-12 h-12 text-background" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              {currentTranslation.title}
            </h2>
            <p className="text-text-secondary mt-4 text-base leading-relaxed max-w-lg mx-auto">
              {currentTranslation.description}
            </p>
          </div>

          {/* Rules */}
          <div className="space-y-4 mb-8 px-6">
            {currentTranslation.rules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-background-secondary/40 border border-border/30 dark:border-border/40 hover:bg-background-secondary/60 hover:border-border/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 flex items-center justify-center flex-shrink-0 group-hover:from-primary-accent/30 group-hover:to-secondary-accent/30 transition-colors">
                  <rule.icon className="w-6 h-6 text-primary-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-text-primary font-semibold mb-2 text-base">
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
          <div className="flex flex-col sm:flex-row gap-3 px-6 pb-8">
            <Button variant="secondary" onClick={onCancel} className="flex-1 h-12 text-base">
              {currentTranslation.cancel}
            </Button>
            <Button onClick={onAccept} className="flex-1 h-12 text-base bg-gradient-to-r from-primary-accent to-secondary-accent hover:from-primary-accent/90 hover:to-secondary-accent/90 shadow-lg shadow-primary-accent/25">
              {currentTranslation.accept}
            </Button>
          </div>
        </motion.div>
        </div>
      </motion.div>
    ,
    document.body
  );
};

export default CommunityRulesModal;
