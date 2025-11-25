// lib/models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  text: { type: String, default: "" },
  attachments: [{ type: String }], // optional URLs
  status: { type: String, enum: ["sent","delivered","seen"], default: "sent" },
  createdAt: { type: Date, default: Date.now },
  seenAt: { type: Date, default: null }
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
