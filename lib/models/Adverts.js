import mongoose from "mongoose";

const AdvertsSchema = new mongoose.Schema({
  name: String,
  image: String,
  content: String,
  link: String,
  isActive: { type: Boolean, default: true },
  startAt: {
    type: Date,
    default: Date.now
  },
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Adverts || mongoose.model("Adverts", AdvertsSchema);
