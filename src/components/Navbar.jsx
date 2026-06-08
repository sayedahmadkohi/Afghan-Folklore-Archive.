import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Explore Stories", path: "/explore", icon: BookOpen },
    ...(isAuthenticated
      ? [{ name: "Add Story", path: "/add-story", icon: Plus }]
      : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 text-background" />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-primary-accent transition-colors">
              Afghan Folklore Archive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-accent group-hover:w-full transition-all duration-300"
                  initial={false}
                  animate={{
                    width: location.pathname === link.path ? "100%" : "0%",
                  }}
                />
              </Link>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-card-background border border-border hover:border-primary-accent transition-colors"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-primary-accent" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-primary-accent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-accent to-secondary-accent text-background font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-card-background border border-border"
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-primary-accent" />
              ) : (
                <Sun className="w-5 h-5 text-primary-accent" />
              )}
            </motion.button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-card-background border border-border"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-secondary border-b border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-text-secondary hover:text-text-primary transition-colors py-2"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-lg">{link.name}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-text-secondary hover:text-text-primary transition-colors py-2 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-lg">Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-text-secondary hover:text-text-primary transition-colors py-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="text-lg">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-text-secondary hover:text-text-primary transition-colors py-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-lg">Register</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
