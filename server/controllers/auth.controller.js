import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort === 587,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, provider: "local" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).json({ message: "Invalid credentials" });
    const user = await User.findOne({ email, provider: "local" });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const social = async (req, res, next) => {
  try {
    const { provider, providerId, name, email } = req.body;
    let user = await User.findOne({ provider, providerId });
    if (!user) {
      user = await User.create({ name, email, provider, providerId });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, provider: "local" });
    if (!user) return res.status(200).json({ message: "If an account exists, a reset link has been sent" });

    const resetToken = jwt.sign(
      { id: user._id, email: user.email, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .header { text-align: center; margin-bottom: 24px; }
            .header h1 { color: #1a1a1a; font-size: 22px; margin: 0 0 8px; }
            .header p { color: #666666; font-size: 14px; margin: 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #e5e5e5; color: #999999; font-size: 12px; text-align: center; }
            .info { background-color: #f9f9f9; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #555555; margin-top: 16px; }
            .token-box { background-color: #f4f4f4; padding: 10px 14px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333333; word-break: break-all; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Smart Inventory System</h1>
              <p>Password Reset Request</p>
            </div>
            <p>Hello ${user.name || "User"},</p>
            <p>We received a request to reset your password for your Smart Inventory account. Click the button below to reset it:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>This link will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <div class="info">
              <strong>Environment Details:</strong>
              <div class="token-box">
                APP: ${process.env.APP_URL || "http://localhost:3000"}<br>
                RESET TOKEN: ${resetToken}
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Smart Inventory System. All rights reserved.</p>
              <p>Image and Maintenance Department</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Reset Your Password - Smart Inventory",
      html: htmlContent,
    });

    res.status(200).json({ message: "If an account exists, a reset link has been sent" });
  } catch (err) {
    console.error("forgotPassword error", err.message);
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password are required" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (decoded.type !== "reset") return res.status(400).json({ message: "Invalid token type" });

    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (err) {
    next(err);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false, message: "Token is required" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ valid: true, decoded });
    } catch {
      res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  } catch (err) {
    next(err);
  }
};
