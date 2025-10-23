import mongoose from "mongoose";

const LeaguesSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: { type: String }, // Store the image URL
  c_name: String,
  s_name: String,
  email: { type: String },
  telephone: String,
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  // 👇 Add this field to reference multiple AgeGroups
  age_groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgeGroups",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Leagues ||
  mongoose.model("Leagues", LeaguesSchema);
