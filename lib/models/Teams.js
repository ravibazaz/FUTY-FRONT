import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: String,
  phone: String,
  image: String,
  email:string,
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Clubs ||
  mongoose.model("Teams", ClubSchema);
