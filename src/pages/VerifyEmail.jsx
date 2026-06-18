import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isAuthenticated } = useAuth();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    navigate("/add-story", { replace: true });
    return null;
  }

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email";
    if (!code.trim()) return "Verification code is required";
    if (!/^\d{6}$/.test(code.trim()))
      return "Verification code must be 6 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const result = await verifyEmail(email.trim(), code.trim());
    setIsLoading(false);

    if (result.success) {
      navigate("/add-story");
    } else {
      setError(result.message);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email to resend the code");
      return;
    }

    setIsResending(true);
    const result = await resendVerification(email.trim());
    setIsResending(false);

    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
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
            Verify Your Email
          </h1>
          <p className="text-text-secondary">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              Email Verification
            </h2>
            <p className="text-text-secondary text-sm">
              Your account will be activated after you verify your email
              address.
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
                setSuccess("");
              }}
            />
            <Input
              icon={KeyRound}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              label="Verification Code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
                setSuccess("");
              }}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Verify Email
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-primary-accent hover:underline font-medium disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend verification code"}
            </button>
          </div>

          <p className="text-center text-text-secondary text-sm">
            Already verified?{" "}
            <Link
              to="/login"
              className="text-primary-accent hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
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

export default VerifyEmail;
