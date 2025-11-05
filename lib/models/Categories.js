import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: { type: String }, // Store the image URL
  isActive: { type: Boolean, default: true },
  parent_cat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },  // Reference to User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Categories || mongoose.model("Categories", CategoriesSchema);
