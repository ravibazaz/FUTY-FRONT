import mongoose from "mongoose";

const TournamentOrderHistoriesSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  status: { type: String, default: "pending" },
  paymentIntentId: String,
  tournament_Id: { type: mongoose.Schema.Types.ObjectId, ref: "Tournaments" }, // Reference to Op Grounds
  created_by_user_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Op Grounds
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TournamentOrderHistories || mongoose.model("TournamentOrderHistories", TournamentOrderHistoriesSchema);
