import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: String,
  image: String,
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Clubs ||
  mongoose.model("Adverts", ClubSchema);
