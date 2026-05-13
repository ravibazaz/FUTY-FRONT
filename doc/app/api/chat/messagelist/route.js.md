# GET /api/chat/messagelist

## Purpose
Returns a paginated list of conversations for the authenticated user with optional type and search filtering.
This endpoint displays the conversation inbox with last message and participant details.

## File Location
`app/api/chat/messagelist/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Connects to MongoDB via `connectDB()`.
- Extracts query parameters: `type` (optional filter), `q` (search term), `page`, `limit`.
- Builds dynamic query based on type parameter:
  - `manager`: Filters to conversations with account_type "Manager".
  - `referee`: Filters to conversations with account_type "Referee".
  - `player`: Filters to conversations with account_type "Player".
  - `unread`: Filters to conversations with unread messages for this user.
  - (none): Returns all conversations for the user.
- Applies optional search filter on participant names (case-insensitive).
- Queries the Conversation collection with user's ID in the room ID (prefix or suffix).
- Returns conversations sorted by last message timestamp (newest first).
- Populates participant details excluding the authenticated user.
- Populates last message details.

## Query Parameters
- `type` (optional) — conversation type filter: "manager", "referee", "player", or "unread" (default: all)
- `q` (optional) — search term to filter conversations by participant name (case-insensitive)
- `page` (optional) — page number for pagination (default: 1)
- `limit` (optional) — conversations per page (default: 20)

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
      "participants": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane",
          "surname": "Smith",
          "nick_name": "jane",
          "profile_image": "/uploads/profiles/jane.jpg"
        }
      ],
      "conversation_type": ["Manager"],
      "participant_name": ["John Doe", "Jane Smith"],
      "lastMessage": {
        "_id": "6432f8901e197c1d8a1b4d30",
        "text": "Thanks, see you later!",
        "senderId": "507f1f77bcf86cd799439012",
        "receiverId": "507f1f77bcf86cd799439011",
        "status": "seen",
        "createdAt": "2024-05-13T15:45:00.000Z"
      },
      "lastMessageAt": "2024-05-13T15:45:00.000Z",
      "unreadCount": {
        "507f1f77bcf86cd799439011": 0
      }
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Message` model from `@/lib/models/Message`
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
  - `Conversation` model from `@/lib/models/Conversation`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Call `await connectDB()`.
  3. Parse `type`, `q`, `page`, `limit` from query string (defaults: page=1, limit=20).
  4. Extract authenticated user ID.
  5. Build dynamic query based on type (manager/referee/player/unread or all).
  6. Apply optional search filter on `participant_name`.
  7. Count total matching conversations.
  8. Execute paginated query sorted by `lastMessageAt` descending.
  9. Populate participants (excluding authenticated user) with user details.
  10. Populate lastMessage with selected fields.
  11. Return success response with conversations and pagination.

## Query Building
- All queries filter by user's room ID (prefix: `userId_*` or suffix: `*_userId`).
- Type filters add conversation_type conditions to the query.
- Unread filter checks `unreadCount.${userId} > 0`.
- Search applies case-insensitive regex on `participant_name`.

## Security
- Requires valid authentication via `protectApiRoute`.
- Filters conversations by authenticated user's ID in room ID.

## Notes
- Pagination defaults: page=1, limit=20.
- Results are sorted by last message timestamp (newest first).
- Participants are populated excluding the authenticated user for cleaner UI.
- Last message is populated with message details for preview display.