import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: String,
  phone: String,
  image: String,
  email:String,
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Teams ||
  mongoose.model("Teams", ClubSchema);
