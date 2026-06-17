// با یوس شروع میشود
//یک تابع خاصی هست که اجازه میدهد قابلیت های را در ری اکت استفاده کنیم
// برای عدم تکرار کد. تابع را فقط یک بار مینویسم و بعدها چندین بار استفاده میکنم
// همچنان برای جدا سازی منطق
// این هوک خواندن و نوشتن در لوکل استوریج مرورگر را با قابلیت ماندگی انجام میدهد
import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
