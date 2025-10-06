// === 1. User model (e.g., in lib/models/User.js) ===
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telephone: { type: String, required: true },
  account_type: { type: String, required: true },
  ground_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grounds" }, // Reference to Op Grounds
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clubs" }, // Reference to Op Grounds
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
