// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  date: { type: Date, default: Date.now, },
  closing_date: { type: Date, default: Date.now, },
  no_of_categories: { type: String, default: '' },
  no_of_teams_per_category: { type: String, default: '' },
  cost_per_team_entry: { type: String, default: '' },
  description: { type: String, default: '' },
  ground: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to Op Clubs
  accepted_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  accepted_by:{ type: String, default: '' },
  images: [String],
  score: { type: String, default: "" },
  outcome: { type: String, trim: true, default: "" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Tournaments || mongoose.model("Tournaments", TournamentSchema);
