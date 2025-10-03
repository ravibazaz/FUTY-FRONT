import mongoose from "mongoose";

const GroundSchema = new mongoose.Schema({
  name: String,
  images: [String],
  add1: String,
  add2: String,
  add3: String,
  pin: String,
  content: String,
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Grounds || mongoose.model("Grounds", GroundSchema);
