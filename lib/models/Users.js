// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";
import { getNextSequence } from "../getNextSequence.js";
const UserSchema = new mongoose.Schema({
  ID: { type: Number, unique: true }, // ✅ Auto-increment field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String, required: true },
  surname: { type: String, default: "" },
  nick_name: { type: String, trim: true, default: "" },
  post_code: { type: String, trim: true, default: "" },
  login_code: { type: String, trim: true, default: "" },
  isVerified: { type: Boolean, default: false },
  telephone: { type: String, required: true },
  account_type: { type: String, required: true },
  profile_description: { type: String, trim: true, default: "" },
  travel_distance: { type: String, trim: true, default: "" },
  referee_lavel: { type: String, trim: true, default: "" },
  referee_fee: { type: String, trim: true, default: "" },
  profile_image: { type: String, trim: true, default: "" }, // Store the image URL
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to Op Grounds
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to Op Grounds
  isActive: { type: Boolean, default: false },
  playing_style: {
    win: {
      value: { type: String },
      percentage: { type: Number },
    },
    style: {
      value: { type: String },
      percentage: { type: Number },
    },
    trophy: {
      value: { type: String },
      percentage: { type: Number },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Pre-save hook to auto-increment ID
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.ID = await getNextSequence("User");
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
