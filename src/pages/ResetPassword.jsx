import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { authAPI } from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email";
    if (!code.trim()) return "Reset code is required";
    if (!/^\d{6}$/.test(code.trim())) return "Reset code must be 6 digits";
    if (!newPassword) return "New password is required";
    if (newPassword.length < 6)
      return "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword(email.trim(), code.trim(), newPassword);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-accent/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-accent/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen className="w-8 h-8 text-background" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Reset Password
          </h1>
          <p className="text-text-secondary">
            Enter the code from your email and choose a new password
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-text-primary">
                Password Reset Successful
              </h3>
              <p className="text-text-secondary text-sm">
                Your password has been updated. You can now sign in with your
                new password.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => navigate("/login")}
              >
                Back to Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">
                  Create New Password
                </h2>
                <p className="text-text-secondary text-sm">
                  Use the 6-digit reset code sent to your email.
                </p>
              </div>

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

              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="your@email.com"
                  label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
                <Input
                  icon={KeyRound}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  label="Reset Code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setError("");
                  }}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Reset Password
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <p className="text-center text-text-secondary text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-primary-accent hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-text-secondary hover:text-primary-accent transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
