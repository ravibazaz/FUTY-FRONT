import mongoose from "mongoose";
import { getNextSequence } from "../getNextSequence.js";
const ClubSchema = new mongoose.Schema({
  ID: { type: Number, unique: true }, // ✅ Auto-increment field
  name: String,
  secretary_name: String,
  phone: String,
  image: String,
  email: String,
  isActive: { type: Boolean, default: true },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'Leagues' },  // Reference to User
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  age_groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgeGroups",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Pre-save hook to auto-increment ID
ClubSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.ID = await getNextSequence("Clubs");
  }
  next();
});


export default mongoose.models.Clubs || mongoose.model("Clubs", ClubSchema);
