import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MyStories from "./MyStories";
import AddStoryForm from "./AddStoryForm";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";

const sidebarItems = [
  { id: "my-stories", label: "My Stories", icon: BookOpen },
  { id: "add-story", label: "Add Story", icon: Plus },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "profile", label: "Profile", icon: User },
];

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState("my-stories");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState(null);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleEditStory = (storyId) => {
    setEditingStoryId(storyId);
    setActiveSection("add-story");
    setIsMobileMenuOpen(false);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "my-stories":
        return { title: "My Stories", description: "Manage your published stories" };
      case "add-story":
        return { title: editingStoryId ? "Edit Story" : "Add Story", description: editingStoryId ? "Edit your story details" : "Share a new story with the community" };
      case "bookmarks":
        return { title: "Bookmarks", description: "Your saved stories" };
      case "profile":
        return { title: "Profile", description: "Manage your account settings" };
      default:
        return { title: "My Stories", description: "Manage your published stories" };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "my-stories":
        return <MyStories onEdit={handleEditStory} />;
      case "add-story":
        return <AddStoryForm editingStoryId={editingStoryId} onClearEdit={() => setEditingStoryId(null)} />;
      case "bookmarks":
        return <Bookmarks />;
      case "profile":
        return <Profile />;
      default:
        return <MyStories onEdit={handleEditStory} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="lg:hidden bg-card-background/50 backdrop-blur-xl border-b border-border p-4 sticky top-20 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-background border border-border"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </motion.button>
            <div>
              <h1 className="text-lg font-bold text-text-primary">{getSectionTitle().title}</h1>
              <p className="text-xs text-text-secondary">{getSectionTitle().description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-20 lg:top-20 left-0 lg:right-0 h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)]
            w-72 bg-card-background/50 backdrop-blur-xl border-r lg:border-l border-border
            transform transition-transform duration-300 ease-in-out z-30
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="h-full flex flex-col p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-background/50 border border-border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-text-secondary text-sm truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSectionChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-primary-accent/20 to-secondary-accent/20 border border-primary-accent/30 text-primary-accent"
                        : "text-text-secondary hover:text-text-primary hover:bg-background/50"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Logout */}
            <div className="pt-4 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
