# POST /api/chat/send

## Purpose
Sends a message from one user to another and broadcasts it in real-time.
This endpoint handles message creation, conversation updates, and real-time delivery via the chat manager.

## File Location
`app/api/chat/send/route.js`

## HTTP Method
POST

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Extracts `receiverId`, `text`, and optional `attachments` from request body.
- Validates that text or attachments are provided; returns error if both missing.
- Generates a unique room ID from sender and receiver IDs.
- Fetches receiver user details (account_type).
- Creates a new Message document with status "sent".
- Updates or creates the Conversation document with:
  - Incremented unread count for receiver.
  - Added participants and conversation types.
  - Extracted participant names for search/display.
- Broadcasts the message in real-time via the chat manager.
- Returns the created message with populated sender/receiver details.

## Query Parameters
- None

## Request Body
```json
{
  "receiverId": "507f1f77bcf86cd799439012",
  "text": "Hello, how are you?",
  "attachments": []
}
```

## Response Example
```json
{
  "success": true,
  "message": {
    "_id": "6432f88f1e197c1d8a1b4d2f",
    "roomId": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
    "senderId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John",
      "surname": "Doe",
      "nick_name": "johnny",
      "profile_image": "/uploads/profiles/john.jpg"
    },
    "receiverId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane",
      "surname": "Smith",
      "nick_name": "jane",
      "profile_image": "/uploads/profiles/jane.jpg"
    },
    "text": "Hello, how are you?",
    "attachments": [],
    "status": "sent",
    "createdAt": "2024-05-13T10:30:00.000Z"
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
  2. Parse `receiverId`, `text`, `attachments` from request body.
  3. Validate text or attachments present; return error if both missing.
  4. Generate room ID via `getChatRoom(user._id, receiverId)`.
  5. Fetch receiver account_type from Users model.
  6. Create Message document with sender, receiver, text, attachments, status="sent".
  7. Update Conversation document with incremented unread count and participant metadata.
  8. Populate and return the created message with user details.
  9. Broadcast message via `chatManager.getRoom(room).send(messages)`.

## Real-time Broadcasting
- Uses `chatManager` to broadcast the message to all connected clients in the room.
- Enables instant delivery to active participants.

## Security
- Requires valid authentication via `protectApiRoute`.
- Associates message with authenticated user ID.

## Notes
- Messages are created with status "sent" before being broadcast.
- The Conversation document is upserted to ensure it exists for future history retrieval.
- Participant names are extracted and stored for efficient conversation filtering.