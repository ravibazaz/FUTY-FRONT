# GET /api/chat/history

## Purpose
Returns paginated message history for a specific chat room.
This endpoint is used for loading and displaying conversation messages with full sender/receiver details.

## File Location
`app/api/chat/history/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Connects to MongoDB via `connectDB()`.
- Extracts required query parameter `room` and optional pagination parameters.
- Returns error if `room` is not provided.
- Queries the Message collection for all messages in the specified room.
- Counts total messages in the room.
- Retrieves paginated results with sender and receiver details populated.
- Sorts messages by creation time (newest first, can be reversed by client if needed).

## Query Parameters
- `room` (required) — the chat room ID to fetch history for
- `page` (optional) — page number for pagination (default: 1)
- `limit` (optional) — messages per page (default: 20)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "data": [
    {
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
      "status": "seen",
      "createdAt": "2024-05-13T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Message` model from `@/lib/models/Message`
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Call `await connectDB()`.
  3. Parse `room`, `page`, `limit` from query string (defaults: page=1, limit=20).
  4. Validate `room` is provided; return error if missing.
  5. Count total documents in room via `Message.countDocuments({ roomId: room })`.
  6. Execute paginated query with `.skip()` and `.limit()`.
  7. Populate sender and receiver with selected fields.
  8. Sort by `createdAt` descending (newest first).
  9. Return success response with messages and pagination metadata.

## Populated Fields
- `senderId`: name, surname, nick_name, profile_image
- `receiverId`: name, surname, nick_name, profile_image

## Security
- Requires valid authentication via `protectApiRoute`.

## Notes
- Pagination defaults: page=1, limit=20.
- Results are sorted newest-first; client can reverse if chronological order needed.
- Uses `.lean()` for performance optimization on read-only queries.