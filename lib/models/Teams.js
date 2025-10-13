import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
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
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User manger
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'Leagues' },  // Reference to league
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Teams ||
  mongoose.model("Teams", ClubSchema);
