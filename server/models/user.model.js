import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String },
  provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
  providerId: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
