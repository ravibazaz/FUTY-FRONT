
import mongoose from "mongoose";

const TournamentAcceptedSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  contact: { type: String, default: '' },
  notes: { type: String, default: '' },
  accepted_by_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Clubs
  tournament_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tournaments" }, // Reference to Op Clubs
  accepted_by: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.TournamentAccepted || mongoose.model("TournamentAccepted", TournamentAcceptedSchema);