import mongoose from "mongoose";

const OrderHistoriesSchema = new mongoose.Schema({
  product_title: String,
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stores' },  // Reference to 
  product_price: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  order_total_price: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  produc_discount: {
    type: Number,
    default: 0, // prevents negative prices
  },
  produc_shipping_cost: {
    type: Number,
    default: 0, // prevents negative prices
  },
  produc_size: String,
  produc_color: String,
  produc_material: String,
  produc_product_code: String,
  produc_other_product_info: String,
  purchased_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.OrderHistories || mongoose.model("OrderHistories", OrderHistoriesSchema);
