import mongoose from "mongoose";
import { getNextSequence } from "../getNextSequence.js";
const TeamSchema = new mongoose.Schema({
  ID: { type: Number, unique: true }, // ✅ Auto-increment field
  name: String,
  phone: String,
  image: String,
  email: String,
  shirt: String,
  shorts: String,
  socks: String,
  attack: String,
  midfield: String,
  defence: String,
  isActive: { type: Boolean, default: true },
  ground: { type: mongoose.Schema.Types.ObjectId, ref: 'Grounds' },  // Reference to Grounds
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Clubs' },  // Reference to Clubs
  age_groups: { type: mongoose.Schema.Types.ObjectId, ref: 'AgeGroups' },  // Reference to User manger
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Pre-save hook to auto-increment ID
TeamSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.ID = await getNextSequence("Teams");
  }
  next();
});

// Virtual populate for all managers of this team
TeamSchema.virtual("managers", {
  ref: "User",         // model name
  localField: "_id",       // field in Team
  foreignField: "team_id",    // field in Manager
  justOne: false,          // ⬅️ allows multiple managers
});

TeamSchema.set("toObject", { virtuals: true });
TeamSchema.set("toJSON", { virtuals: true });



export default mongoose.models.Teams ||
  mongoose.model("Teams", TeamSchema);
