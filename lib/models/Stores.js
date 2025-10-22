import mongoose from "mongoose";

const StoresSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: { type: String}, // Store the image URL
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Stores ||
  mongoose.model("Stores", StoresSchema);
