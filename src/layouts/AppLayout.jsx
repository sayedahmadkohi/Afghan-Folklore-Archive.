import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import StoryDetails from "../pages/StoryDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import AddStory from "../pages/AddStory";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Home />
                </AnimatedPage>
              }
            />
            <Route
              path="/explore"
              element={
                <AnimatedPage>
                  <Explore />
                </AnimatedPage>
              }
            />
            <Route
              path="/story/:id"
              element={
                <AnimatedPage>
                  <StoryDetails />
                </AnimatedPage>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />
            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AnimatedPage>
                  <ForgotPassword />
                </AnimatedPage>
              }
            />
            <Route
              path="/add-story"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <AddStory />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
