import mongoose from "mongoose";

const VendorsSchema = new mongoose.Schema({
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
  endAt: {
    type: Date,
    default: Date.now
  },
  end_date: String,
  end_time: String,
  pages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Vendors || mongoose.model("Vendors", VendorsSchema);
