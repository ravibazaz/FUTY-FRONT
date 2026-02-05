// lib/models/Conversation.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // e.g. "5_12"
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  conversation_type: [{ type: String }],
  participant_name: [{ type: String }],
  lastMessageAt: { type: Date },
  unreadCount: { type: Map, of: Number, default: {} }, // unread per user id
}, { timestamps: true });


ConversationSchema.virtual('lastMessage', {
  ref: 'Message',
  localField: 'roomId',
  foreignField: 'roomId',
  justOne: true,
  options: { sort: { createdAt: -1 } }
});

ConversationSchema.set('toObject', { virtuals: true });
ConversationSchema.set('toJSON', { virtuals: true });


export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
