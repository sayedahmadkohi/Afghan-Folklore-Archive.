// این لایه اصلی برنامه هست. که ساحتار کلی صحفه را نمایش میدهد
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import StoryDetails from "../pages/StoryDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import AddStory from "../pages/AddStory";
import SavedStories from "../pages/SavedStories";
import About from "../pages/About";

// تنظمیات انمیشن
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

//
const pageTransition = {
  type: "tween", // انمیشن خطی
  ease: "anticipate", // افکت نرم با کمی عقب کشیدن
  duration: 0.5,
};

//بخش کامپونیت ها
// هر صفحه باید داخل این کامپونیت قرار گیرد تا انیمشن داشته باشد.
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

// کامپونیت اصلی  کل صفحه با ارتفاع کامل و رنگ پس زمینه
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Navbar />

      <main className="pt-16 md:pt-20">
        {" "}
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
              path="/about"
              element={
                <AnimatedPage>
                  <About />
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
              path="/verify-email"
              element={
                <AnimatedPage>
                  <VerifyEmail />
                </AnimatedPage>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AnimatedPage>
                  <ResetPassword />
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
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <SavedStories />
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
