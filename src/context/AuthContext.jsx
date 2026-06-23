// هر یک از موارد که امپورت شده هدف خاصی دارد.
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const mapUser = (userData) => ({
  id: userData.id || userData._id,
  name: userData.fullName,
  email: userData.email,
  acceptedRules: userData.acceptedRules,
  isEmailVerified: userData.isEmailVerified,
  savedStories: userData.savedStories || [],
});

const setSession = (token, userData, setUser, setIsAuthenticated) => {
  localStorage.setItem("afa_token", token);
  setUser(mapUser(userData));
  setIsAuthenticated(true);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("afa_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("afa_isAuthenticated")) === true;
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("afa_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("afa_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "afa_isAuthenticated",
      JSON.stringify(isAuthenticated),
    );
  }, [isAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem("afa_token");
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          setUser(mapUser(res.data));
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("afa_token");
          localStorage.removeItem("afa_user");
          localStorage.removeItem("afa_isAuthenticated");
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      const { token, user: userData } = res.data;
      setSession(token, userData, setUser, setIsAuthenticated);
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      const message = data?.message || "Login failed. Please try again.";
      return {
        success: false,
        message,
        requiresVerification: data?.requiresVerification === true,
        email: data?.email,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register(name, email, password);
      return {
        success: true,
        requiresVerification: res.data.requiresVerification === true,
        email: res.data.email,
        message: res.data.message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      const res = await authAPI.verifyEmail(email, code);
      const { token, user: userData } = res.data;
      setSession(token, userData, setUser, setIsAuthenticated);
      return { success: true, message: res.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      return { success: false, message };
    }
  };

  const resendVerification = async (email) => {
    try {
      const res = await authAPI.resendVerification(email);
      return { success: true, message: res.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to resend verification code. Please try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("afa_token");
    localStorage.removeItem("afa_user");
    localStorage.removeItem("afa_isAuthenticated");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
