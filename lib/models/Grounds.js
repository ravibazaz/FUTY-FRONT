import mongoose from "mongoose";

const GroundSchema = new mongoose.Schema({
  name: String,
  images: [String],
  // 👇 Add this field to reference multiple facilities
  facilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroundFacilities",
    },
  ],
  add1: String,
  add2: String,
  add3: String,
  pin: String,
  content: String,
  county: String,
  lat: Number,
  long: Number,
  location: {
    type: {
      type: String,
      enum: ["Point"], // must be 'Point'
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
  },
  isActive: { type: Boolean, default: true },
  isHomeGround: { type: String, default: 'No' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

GroundSchema.index({ location: "2dsphere" });
export default mongoose.models.Grounds || mongoose.model("Grounds", GroundSchema);
