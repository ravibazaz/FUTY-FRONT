import mongoose from "mongoose";

const AdvertsSchema = new mongoose.Schema({
  name: String,
  image: String,
  content: String,
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Adverts || mongoose.model("Adverts", AdvertsSchema);
