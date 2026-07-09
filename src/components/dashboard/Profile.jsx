import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import Button from "../Button";

const Profile = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to change password. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary">Manage your account settings</p>
      </motion.div>

      {/* Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 space-y-6"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-background" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-bold text-text-primary">
              {user?.name || "User"}
            </h2>
            <p className="text-text-secondary">{user?.email || ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <User className="w-4 h-4" />
              <span>Username</span>
            </div>
            <p className="text-text-primary font-medium">
              {user?.name || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
            <p className="text-text-primary font-medium">
              {user?.email || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Email Status</span>
            </div>
            <p
              className={`font-medium ${
                user?.isEmailVerified ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {user?.isEmailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-text-secondary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Change Password
            </h3>
          </div>
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="text-primary-accent text-sm font-medium hover:underline"
          >
            {isChangingPassword ? "Cancel" : "Change"}
          </button>
        </div>

        {isChangingPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-card-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300"
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
