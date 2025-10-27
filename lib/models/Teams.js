import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
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

export default mongoose.models.Teams ||
  mongoose.model("Teams", TeamSchema);
