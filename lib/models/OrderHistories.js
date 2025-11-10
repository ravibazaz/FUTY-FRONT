import mongoose from "mongoose";

const OrderHistoriesSchema = new mongoose.Schema({
  order_product_title: String,
  order_product_image: String,
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stores' },  // Reference to 
  order_product_price: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  order_total_price: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  order_quantity: {
    type: Number,
    required: true,
    min: 0, // prevents negative prices
  },
  order_product_discount: {
    type: Number,
    default: 0, // prevents negative prices
  },
  order_product_shipping_cost: {
    type: Number,
    default: 0, // prevents negative prices
  },
  order_product_size: String,
  order_product_color: String,
  order_product_material: String,
  order_product_product_code: String,
  order_product_other_product_info: String,
  purchased_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.OrderHistories || mongoose.model("OrderHistories", OrderHistoriesSchema);
