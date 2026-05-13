# POST /api/chat/typing

## Purpose
Broadcasts a user's typing status to all participants in a chat room.
This endpoint enables real-time "typing..." indicators in the UI.

## File Location
`app/api/chat/typing/route.js`

## HTTP Method
POST

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Extracts `room` and `typing` (boolean) from the JSON request body.
- Validates all required fields are present; returns error if missing or `typing` is not a boolean.
- Retrieves the chat room instance from `chatManager`.
- Broadcasts a "typing" event to all connected clients in the room.
- Event includes the user ID, typing status, and current timestamp.
- Returns success response.

## Query Parameters
- None

## Request Body
```json
{
  "room": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439012",
  "typing": true
}
```

## Response Example
```json
{
  "success": true,
  "message": "Typing status updated"
}
```

## Implementation Details
- Imports:
  - `chatManager` from `@/lib/chatManager`
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Extract user ID from authenticated user.
  3. Parse `room` and `typing` from request body.
  4. Validate `room` is provided, `typing` is boolean.
  5. Return error if validation fails.
  6. Retrieve room instance via `chatManager.getRoom(room)`.
  7. Broadcast typing event: `roomInst.send("typing", { from: userId, typing, time: Date.now() })`.
  8. Return success response with message.

## Broadcasting
- Uses `chatManager` to send typing event to all connected clients in the room.
- Event includes:
  - `from`: The user ID of the typing person.
  - `typing`: Boolean indicating if user started or stopped typing.
  - `time`: Server timestamp for ordering events.

## Security
- Requires valid authentication via `protectApiRoute`.
- Typing status associated with authenticated user.
- Prevents spoofing of "user X is typing" notifications.

## Notes
- Clients should send `typing: true` when user starts typing.
- Clients should send `typing: false` when user stops typing or input loses focus.
- Clients typically debounce typing status to avoid excessive broadcasts.
- The timestamp allows receivers to detect and hide stale typing indicators.
- Consider adding a timeout on the server side to auto-clear typing status after inactivity.