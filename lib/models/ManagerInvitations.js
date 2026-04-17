import mongoose from "mongoose";

const ManagerInvitationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to admin user
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" }, // Reference to team  id
  manager_email: { type: String, required: true },
  manager_name: { type: String },
  manager_phone: { type: String },
  manager_nick_name: { type: String, trim: true, default: "" },
  manager_address: { type: String, trim: true, default: "" },
  manager_invitation_code: { type: String, trim: true, default: "" },
  accepted_by: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.ManagerInvitations || mongoose.model("ManagerInvitations", ManagerInvitationSchema);