import mongoose from "mongoose";

const ManagerFriendLieSchema = new mongoose.Schema({
  op_team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to a Team
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Manger User
  date:  {
    type: Date,
    default: Date.now,
  },
  time: String,
  status: String,
  scores: String,
  outcome: String,
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Manger User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ManagerFriendLies ||
  mongoose.model("ManagerFriendLies", ManagerFriendLieSchema);
