import mongoose from "mongoose";

const CartsSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stores' },  // Reference to 
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Carts || mongoose.model("Carts", CartsSchema);
