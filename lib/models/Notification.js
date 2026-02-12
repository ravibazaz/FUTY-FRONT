import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  title: String,
  body: String,

  type: String, // "chat" | "system" | "friend_request" etc

  data: {
    type: Object, // extra payload (chat room id, message id, etc)
    default: {},
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  readAt: Date,

}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
