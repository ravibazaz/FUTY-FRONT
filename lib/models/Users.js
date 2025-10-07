// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String, required: true },
  surname: { type: String, required: true },
  nick_name: { type: String, trim: true, default: "" },
  post_code: { type: String, trim: true, default: "" },
  telephone: { type: String, required: true },
  account_type: { type: String, required: true },
  profile_description: { type: String, trim: true, default: "" },
  profile_image: { type: String,trim: true, default: ""}, // Store the image URL
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to Op Grounds
  isActive: { type: Boolean, default: false },
  playing_style: {
    win: {
      value: { type: String },
      percentage: { type: Number },
    },
    style: {
      value: { type: String},
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

export default mongoose.models.User || mongoose.model("User", UserSchema);
