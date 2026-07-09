import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Plus, 
  Bookmark, 
  LogOut, 
  User,
  Mail,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardAuth = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "My Stories",
      description: "Add and manage your folklore stories",
      icon: Plus,
      path: "/add-story",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Saved Stories",
      description: "View your bookmarked stories",
      icon: Bookmark,
      path: "/saved",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </motion.button>
      </div>

      {/* User Info Card */}
      <div className="bg-card-background border border-border rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-background" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm text-text-secondary">Name</p>
              <p className="text-text-primary font-medium">{user?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-text-primary font-medium flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user?.email || "N/A"}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email Status</p>
              <p className={`font-medium ${user?.isEmailVerified ? "text-green-500" : "text-yellow-500"}`}>
                {user?.isEmailVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card-background border border-border rounded-xl p-6 hover:border-primary-accent transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary-accent transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardAuth;
