# POST /api/chat/read

## Purpose
Marks all unread messages in a chat room as seen for the authenticated user.
This endpoint updates message statuses and conversation unread counts for receipt tracking.

## File Location
`app/api/chat/read/route.js`

## HTTP Method
POST

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Extracts `room` from the JSON request body.
- Returns error if `room` is not provided.
- Connects to MongoDB via `connectDB()`.
- Queries the Message collection for all unread messages in the room where the user is the receiver.
- Updates all unread messages with status "seen" and records the `seenAt` timestamp.
- Resets the unread count for this user in the Conversation document to 0.
- Broadcasts a "read" event to all connected clients in the room via the chat manager.

## Query Parameters
- None

## Request Body
```json
{
  "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012"
}
```

## Response Example
```json
{
  "success": true
}
```

## Implementation Details
- Imports:
  - `chatManager` from `@/lib/chatManager`
  - `connectDB` from `@/lib/db`
  - `Message` model from `@/lib/models/Message`
  - `Conversation` model from `@/lib/models/Conversation`
  - `mongoose` (imported but not used in visible code)
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Parse `room` from request body; return error if missing.
  3. Call `await connectDB()`.
  4. Query unread messages: `Message.find({ roomId: room, receiverId: userId, status: { $ne: "seen" } })`.
  5. Update all unread messages: `Message.updateMany({ _id: { $in: messageIds } }, { $set: { status: "seen", seenAt: new Date() } })`.
  6. Reset unread count in conversation: `Conversation.updateOne({ roomId: room }, { $set: { [`unreadCount.${userId}`]: 0 } })`.
  7. Broadcast read event: `roomInst.send("read", { userId, messageIds, time: Date.now() })`.
  8. Return success response.

## Database Updates
- **Messages**: status changed from any non-"seen" value to "seen", seenAt timestamp added.
- **Conversation**: unreadCount for this user reset to 0.

## Broadcasting
- Broadcasts "read" event to all connected clients in the room.
- Event includes array of message IDs that were marked as seen.
- Enables real-time receipt acknowledgment in the UI.

## Security
- Requires valid authentication via `protectApiRoute`.
- Only marks messages received by the authenticated user as seen.

## Notes
- This endpoint handles both message-level and conversation-level unread state.
- Real-time broadcasting allows other participants to see receipt confirmations immediately.
- The `seenAt` timestamp provides audit trail for read receipts.