import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByEmail, findByProvider, create, findById, findAndUpdate } from "../models/user.model.js";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);

const transporter = {
  sendMail: async () => {},
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await create({ name, email, password: hashed, provider: "local" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).json({ message: "Invalid credentials" });
    const user = findByEmail(email);
    if (!user || !user.password || user.provider !== "local") return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const social = async (req, res, next) => {
  try {
    const { provider, providerId, name, email } = req.body;
    let user = findByProvider(provider, providerId);
    if (!user) {
      user = await create({ name, email, provider, providerId });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = findByEmail(email);
    if (!user) return res.status(200).json({ message: "If an account exists, a reset link has been sent" });

    const resetToken = jwt.sign(
      { id: user._id, email: user.email, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Reset Your Password - Smart Inventory",
      html: `<html><body><h1>Smart Inventory</h1><p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p></body></html>`,
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
    findAndUpdate(decoded.id, { password: hashed });

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
