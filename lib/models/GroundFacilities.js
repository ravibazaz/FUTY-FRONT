import mongoose from "mongoose";

const GroundFacilitiesSchema = new mongoose.Schema({
  facilities: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.GroundFacilities || mongoose.model("GroundFacilities", GroundFacilitiesSchema);