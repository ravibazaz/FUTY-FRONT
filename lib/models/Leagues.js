import mongoose from "mongoose";

const LeaguesSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: { type: String}, // Store the image URL
  name: String,
  pin: String,
  url: String,
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Leagues ||
  mongoose.model("Leagues", LeaguesSchema);
