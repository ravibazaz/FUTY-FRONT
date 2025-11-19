// lib/models/Conversation.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // e.g. "5_12"
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  lastMessageAt: { type: Date },
  unreadCount: { type: Map, of: Number, default: {} }, // unread per user id
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
