// سرویس یک لایه واسط بین ری اکت و سرور هست  که وظایف آن عبارتند از
//ارسال درحواست به بکند
// مدریت های توکن ها و احزار هویت
// هندل کردن خطاها به صورت متمرکز
// آماده کردن داده ها برای ارسال ودریافت
import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("afa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("afa_token");
      localStorage.removeItem("afa_user");
      localStorage.removeItem("afa_isAuthenticated");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (fullName, email, password) =>
    api.post("/auth/register", { fullName, email, password }),
  verifyEmail: (email, code) =>
    api.post("/auth/verify-email", { email, code }),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (email, code, newPassword) =>
    api.post("/auth/reset-password", { email, code, newPassword }),
  getMe: () => api.get("/auth/me"),
  acceptRules: () => api.put("/auth/accept-rules"),
  toggleSave: (storyId) => api.post(`/auth/toggle-save/${storyId}`),
  getSavedStories: () => api.get("/auth/saved-stories"),
  changePassword: (data) => api.put("/auth/change-password", data),
  updateProfile: (data) => api.put("/auth/update-profile", data),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getAllStories: (page = 1, limit = 10, search = "", status = "") =>
    api.get("/admin/stories", { params: { page, limit, search, status } }),
  getAllUsers: (page = 1, limit = 10, search = "") =>
    api.get("/admin/users", { params: { page, limit, search } }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

// Stories API
export const storiesAPI = {
  getAll: (page = 1, limit = 9, search = "", category = "", language = "") =>
    api.get("/stories", { params: { page, limit, search, category, language } }),
  getMy: () => api.get("/stories/my"),
  getOne: (id) => api.get(`/stories/${id}`),
  create: (formData) =>
    api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/stories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/stories/${id}`),
  toggleLike: (id) => api.post(`/stories/${id}/like`),
  incrementView: (id) => api.post(`/stories/${id}/view`),
  approve: (id) => api.put(`/stories/${id}/approve`),
  reject: (id) => api.put(`/stories/${id}/reject`),
};

export default api;
