import mongoose from "mongoose";

const PlayerInvitatinSchema = new mongoose.Schema({
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Manager
  player_email: { type: String, required: true },
  player_name: { type: String, required: true },
  player_phone: { type: String, required: true },
  player_nick_name: { type: String, trim: true, default: "" },
  player_address: { type: String, trim: true, default: "" },
  player_invitation_code: { type: String, trim: true, default: "" },
  accepted_by: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.PlayerInvitatins || mongoose.model("PlayerInvitatins", PlayerInvitatinSchema);