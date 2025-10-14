// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const FriendlieSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, },
  time: { type: String, default: () => new Date().toLocaleTimeString() }, // hashed password
  team_id_first: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to Op Grounds
  team_id_second: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to Op Grounds
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  status: {
    type: String,
    enum: ["On Going", "Completed", "Archive"], // allowed values only
    default: "On Going", // optional default
  },
  score: { type: String, default: "" },
  outcome: { type: String, trim: true, default: "" },
  isActive: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Friendlies || mongoose.model("Friendlies", FriendlieSchema);
