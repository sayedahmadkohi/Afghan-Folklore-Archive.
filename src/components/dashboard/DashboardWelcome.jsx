import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";

const DashboardWelcome = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center"
        >
          <LayoutDashboard className="w-10 h-10 text-background" />
        </motion.div>

        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Dashboard
        </h1>

        <p className="text-lg text-text-secondary mb-12">
          Manage your account and stories.
        </p>

        <div className="space-y-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-lg bg-gradient-to-r from-primary-accent to-secondary-accent text-background font-medium text-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </motion.button>
          </Link>

          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-lg bg-card-background border border-border text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-colors font-medium text-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardWelcome;
