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


// Virtual populate for all clubs of this team
LeaguesSchema.virtual("clubs", {
  ref: "Clubs",         // model name
  localField: "_id",       // field in Team
  foreignField: "league",    // field in Manager
  justOne: false,          // ⬅️ allows multiple clubs
});

LeaguesSchema.set("toObject", { virtuals: true });
LeaguesSchema.set("toJSON", { virtuals: true });


// ✅ Pre-save hook to auto-increment ID
LeaguesSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.ID = await getNextSequence("Leagues");
  }
  next();
});

export default mongoose.models.Leagues ||
  mongoose.model("Leagues", LeaguesSchema);
