import mongoose from "mongoose";

const FanInvitationSchema = new mongoose.Schema({
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Manager
  fan_email: { type: String, required: true },
  fan_name: { type: String },
  fan_phone: { type: String },
  fan_nick_name: { type: String, trim: true, default: "" },
  fan_address: { type: String, trim: true, default: "" },
  fan_invitation_code: { type: String, trim: true, default: "" },
  accepted_by: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.FanInvitations || mongoose.model("FanInvitations", FanInvitationSchema);