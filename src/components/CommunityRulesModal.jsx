// قوانین انجمن را در اینجا میسازه
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
const CommunityRulesModal = ({ onAccept, onCancel }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const currentTranslation = translations[selectedLanguage];
  // ساختار اصلی مودال
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

          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-card-background border border-border rounded-lg p-1">
              {["English", "فارسی", "پشتو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    selectedLanguage === lang
                      ? "bg-primary-accent text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

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
              {currentTranslation.title}
            </h2>
            <p className="text-text-secondary mt-2">
              {currentTranslation.description}
            </p>
          </div>

          {/* Rules */}
          <div className="space-y-4 mb-8">
            {currentTranslation.rules.map((rule, index) => (
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
              {currentTranslation.cancel}
            </Button>
            <Button onClick={onAccept} className="flex-1">
              {currentTranslation.accept}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityRulesModal;
