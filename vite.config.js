import { defineConfig } from "vite"; // این تابع برای خواناتر شدن تنطیمات نوشته شده است.
import react from "@vitejs/plugin-react";

export default defineConfig({
  // تنظیمات ری اکت از اینجا شروع میشود.
  plugins: [react()],
  // تنظیمات سرور توسعه در وقت اجرا
  server: {
    // برای حل مشکل وصل شدن بکند و فرانت اند
    proxy: {
      "/api": {
        // یعنی هر درخواستی با ای پی آی شورع میشود بفرست به بکند
        target: "http://localhost:5000", // مقصد نهایی بکند
        changeOrigin: true, // هدر درخواست را طوری تغییر بده که بکند فکر کند مسفیم ازخودش هست
      },
      "/uploads": {
        // برای فایل اپلود
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
