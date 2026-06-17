// هر یک از موارد که امپورت شده هدف خاصی دارد.
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);
// هوک سفارشی اگر درجایی درستی استفاده نشود خطا میدهد.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
//
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

  // Persist state to localStorage
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

  // Restore session from token on mount
  useEffect(() => {
    const token = localStorage.getItem("afa_token");
    if (token && isAuthenticated) {
      authAPI
        .getMe()
        .then((res) => {
          const userData = res.data;
          setUser({
            id: userData.id || userData._id,
            name: userData.fullName,
            email: userData.email,
            acceptedRules: userData.acceptedRules,
          });
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token invalid
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
      localStorage.setItem("afa_token", token);
      setUser({
        id: userData.id || userData._id,
        name: userData.fullName,
        email: userData.email,
        acceptedRules: userData.acceptedRules,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register(name, email, password);
      const { token, user: userData } = res.data;
      localStorage.setItem("afa_token", token);
      setUser({
        id: userData.id || userData._id,
        name: userData.fullName,
        email: userData.email,
        acceptedRules: userData.acceptedRules,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
