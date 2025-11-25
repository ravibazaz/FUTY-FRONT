// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const FriendlieSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  date: { type: Date, default: Date.now, },
  time: { type: String, default: () => new Date().toLocaleTimeString() }, // hashed password
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to Team
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to manger
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to  Grounds
  league_id: { type: mongoose.Schema.Types.ObjectId, ref: "Leagues" }, // Reference to League
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ["Friendly Posted","Friendly Accepted"], // allowed values only
    default: "Friendly Posted", // optional default
  },
  // images: [String],
  created_by_user_score: { type: String, default: "" },
  accepted_by_user_score: { type: String,default: "" },
  created_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  accepted_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Friendlies || mongoose.model("Friendlies", FriendlieSchema);
