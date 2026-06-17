// برای رندر کردن در مرورگر
import React from "react";
import ReactDOM from "react-dom/client";
// app  کامپونیت اصلی برنامه است
import App from "./App.jsx";
// دو پروایدر از پوشه کانتکس
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
// استایل های سراسری
import "./index.css";

// برنامه داخل index.html در المان root  قرار دارد.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {" "}
      <AuthProvider>
        {" "}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
