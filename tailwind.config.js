/** @type {import('tailwindcss').Config} */ //  به وی اس میگوید که این فایل تنظمیات تلویند است.
export default {
  // کجا دنبال تنطمیات بگردد
  // اگر داخل [] خالی باشد هیچ تولید سی اس اس نمیشود
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // روش کلاس سازی دارک مود
  darkMode: "class",
  theme: {
    // این یعنی تنظمات قبلی را حذف نکن جدید هارا اضافه کن
    extend: {
      colors: {
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "card-background": "var(--color-card-background)",
        "primary-accent": "var(--color-primary-accent)",
        "secondary-accent": "var(--color-secondary-accent)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
      },
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
    },
  },
  plugins: [],
};
