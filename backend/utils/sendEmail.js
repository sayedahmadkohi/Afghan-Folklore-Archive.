import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async (to, code) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Afghan Folklore Archive" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email address",
    html: `
      <h2>Email Verification</h2>
      <p>Thank you for registering with Afghan Folklore Archive.</p>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 4px;">${code}</h1>
      <p>This code expires in 15 minutes.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (to, code) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Afghan Folklore Archive" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password reset code",
    html: `
      <h2>Password Reset</h2>
      <p>You requested to reset your password for Afghan Folklore Archive.</p>
      <p>Your reset code is:</p>
      <h1 style="letter-spacing: 4px;">${code}</h1>
      <p>This code expires in 15 minutes.</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    `,
  });
};
