import mongoose from "mongoose";
import { getNextSequence } from "../getNextSequence.js";
const LeaguesSchema = new mongoose.Schema({
  ID: { type: Number, unique: true }, // ✅ Auto-increment field
  title: String,
  content: String,
  image: { type: String }, // Store the image URL
  c_name: String,
  s_name: String,
  email: { type: String },
  telephone: String,
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  // 👇 Add this field to reference multiple AgeGroups
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
LeaguesSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.ID = await getNextSequence("Leagues");
  }
  next();
});

export default mongoose.models.Leagues ||
  mongoose.model("Leagues", LeaguesSchema);
