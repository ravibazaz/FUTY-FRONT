import mongoose from "mongoose";

const StoresSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: { type: String }, // Store the image URL
  isActive: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },  // Reference to 
  price: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  discount: {
    type: Number,
    default: 0, // prevents negative prices
  },
  shipping_cost: {
    type: Number,
    default: 0, // prevents negative prices
  },
  size: String,
  color: String,
  material: String,
  product_code: String,
  other_product_info: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Stores ||
  mongoose.model("Stores", StoresSchema);
