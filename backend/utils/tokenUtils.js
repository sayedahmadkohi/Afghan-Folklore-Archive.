import crypto from "crypto";

const CODE_EXPIRY_MINUTES = 15;

export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashCode = (code) => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

export const getCodeExpiry = () => {
  return new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
};

export const isCodeExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
};
