import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: String,
  secretary_name: String,
  phone: String,
  image: String,
  email: String,
  isActive: { type: Boolean, default: true },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'Leagues' },  // Reference to User
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Clubs || mongoose.model("Clubs", ClubSchema);
