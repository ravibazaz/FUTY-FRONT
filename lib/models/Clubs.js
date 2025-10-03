import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: String,
  phone: String,
  image: String,
  email:string,
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Clubs ||
  mongoose.model("Clubs", ClubSchema);
