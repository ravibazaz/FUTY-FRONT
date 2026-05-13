# POST /api/chat/presence

## Purpose
Broadcasts user presence status (online/offline) to all participants in a chat room.
This endpoint enables real-time presence indicators in the UI.

## File Location
`app/api/chat/presence/route.js`

## HTTP Method
POST

## Authentication Required
No

## Behavior
- Extracts `room`, `userId`, and `status` from the JSON request body.
- Validates all three fields are provided; returns error if any missing.
- Retrieves the chat room instance from `chatManager`.
- Broadcasts a "presence" event to all connected clients in the room.
- Event includes user ID, status, and current timestamp.

## Query Parameters
- None

## Request Body
```json
{
  "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "status": "online"
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
- Handler steps:
  1. Parse `room`, `userId`, `status` from request body.
  2. Validate all three fields are present; return error if missing.
  3. Retrieve room instance via `chatManager.getRoom(room)`.
  4. Broadcast presence event: `roomInst.send("presence", { userId, status, time: Date.now() })`.
  5. Return success response.

## Broadcasting
- Uses `chatManager` to send presence event to all connected clients in the room.
- Event includes timestamp for server-side tracking.
- Status values typically: "online", "offline", "away", etc.

## Security
- ⚠️ **Warning**: This endpoint has no authentication. Any client can broadcast presence for any user ID.
- Consider adding `protectApiRoute()` middleware to verify user authenticity.

## Notes
- This endpoint relies on `chatManager` for real-time event broadcasting.
- No database operations; presence is broadcast in-memory only.
- Consider persisting presence state if durable tracking is needed.
- Event timestamp allows clients to detect stale presence updates.
