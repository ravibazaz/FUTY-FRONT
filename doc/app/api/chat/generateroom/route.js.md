# POST /api/chat/generateroom

## Purpose
Generates and returns a unique chat room ID for a conversation between two users.
This endpoint initializes a new chat room or retrieves an existing one for a sender-receiver pair.

## File Location
`app/api/chat/generateroom/route.js`

## HTTP Method
POST

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Extracts `senderId` and `receiverId` from the JSON request body.
- Validates both IDs are provided; returns error if missing.
- Uses `getChatRoom()` helper to generate a deterministic room ID from the two user IDs.
- Returns the generated room ID in the response.

## Query Parameters
- None

## Request Body
```json
{
  "senderId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439012"
}
```

## Response Example
```json
{
  "success": true,
  "message": {
    "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012"
  }
}
```

## Implementation Details
- Imports:
  - `chatManager` from `@/lib/chatManager`
  - `connectDB` from `@/lib/db`
  - `Message` model from `@/lib/models/Message`
  - `Conversation` model from `@/lib/models/Conversation`
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
  - `getChatRoom` from `@/lib/chatHelpers`
  - `Users` model from `@/lib/models/Users`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Parse `receiverId` and `senderId` from request body.
  3. Validate both IDs are present; return error if missing.
  4. Call `getChatRoom(senderId, receiverId)` to generate room ID.
  5. Return success response with room ID.

## Security
- Requires valid authentication via `protectApiRoute`.
- Validates required fields before generating room.

## Notes
- The room ID is deterministically generated from the two user IDs (order-independent).
- This endpoint should be called before sending messages to ensure a room exists.
- The room ID is used for subsequent message sends, history retrieval, and stream connections.