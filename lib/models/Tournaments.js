// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  date: { type: Date, default: Date.now, },
  time: { type: String, default: () => new Date().toLocaleTimeString() }, // hashed password
  venue: { type: String, default: "" },
  total_amount: { type: String, default: '' },
  email: { type: String, default: '' },
  contact: { type: String, default: '' },
  notes: { type: String, default: '' },
  closing_date: { type: Date, default: Date.now, },
  no_of_categories: { type: String, default: '' },
  no_of_teams_per_category: { type: String, default: '' },
  cost_per_team_entry: { type: String, default: '' },
  description: { type: String, default: '' },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to Team
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to manger
  league_id: { type: mongoose.Schema.Types.ObjectId, ref: "Leagues" }, // Reference to League
  ground: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to Op Clubs
  accepted_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  created_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  accepted_by: { type: String, default: '' },
  images: [String],
  score: { type: String, default: "" },
  outcome: { type: String, trim: true, default: "" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Tournaments || mongoose.model("Tournaments", TournamentSchema);
