// backend/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer Setup Error:", error.message);
  } else {
    console.log("✅ Nodemailer is ready to send secure emails!");
  }
});

// 1. Existing Verification Email
export const sendVerificationEmail = async (userEmail, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"FitFusion Portal" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "🏋️ Activate Your FitFusion Account",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 550px; border: 1px solid #eee; border-radius: 10px; margin: 0 auto;">
        <h2 style="color: #ff4757; text-align: center;">Welcome to FitFusion!</h2>
        <p style="color: #333; font-size: 15px;">Please click the button below to verify your email:</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" style="background-color: #ff4757; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 2. NEW: Password Reset Email
export const sendPasswordResetEmail = async (userEmail, token) => {
  // This URL should point to a page in your React frontend that handles the reset
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"FitFusion Security" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "🔐 Reset Your FitFusion Password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 550px; border: 1px solid #eee; border-radius: 10px; margin: 0 auto;">
        <h2 style="color: #ff4757; text-align: center;">Reset Your Password</h2>
        <p style="color: #333; font-size: 15px;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" style="background-color: #ff4757; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 12px;">This link will expire in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};