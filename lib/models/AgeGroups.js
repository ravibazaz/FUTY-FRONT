import mongoose from "mongoose";

const AgeGroupsSchema = new mongoose.Schema({
  age_group: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AgeGroups || mongoose.model("AgeGroups", AgeGroupsSchema);
