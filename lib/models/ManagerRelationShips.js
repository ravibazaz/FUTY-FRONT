import mongoose from "mongoose";

const ManagerRelationShipSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to a Team
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to a club
  league_id: { type: mongoose.Schema.Types.ObjectId, ref: "Leagues" }, // Reference to a League
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
  win: String,
  style: string,
style: string,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ManagerRelationShips ||
  mongoose.model("ManagerRelationShips", ManagerRelationShipSchema);
