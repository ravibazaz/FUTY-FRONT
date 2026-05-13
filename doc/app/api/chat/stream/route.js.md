# GET /api/chat/stream

## Purpose
Provides a Server-Sent Events (SSE) stream for real-time chat updates in a specific room.
This endpoint enables clients to receive live messages, typing indicators, presence updates, and read receipts.

## File Location
`app/api/chat/stream/route.js`

## HTTP Method
GET

## Authentication Required
No (considers optional `user` parameter in query)

## Behavior
- Extracts `room` and optional `user` query parameters.
- Returns error if `room` is not provided.
- Retrieves the chat room instance from `chatManager`.
- Establishes an SSE connection with proper headers.
- Sends initial "connected" event.
- Sends keepalive ping every 15 seconds to maintain connection.
- Registers an event listener on the room instance.
- Streams all room events (messages, typing, presence, read receipts) to the client.
- Cleans up resources when the client disconnects or stream is cancelled.

## Query Parameters
- `room` (required) — the chat room ID to subscribe to
- `user` (optional) — optional user ID for presence tracking (not actively used in handler)

## Response Format
Server-Sent Events (text/event-stream):
```
data: {"event": "connected"}

data: {"_id": "...", "roomId": "...", "text": "Hello!"}

data: {"ping": 1715599800000}

data: {"typing": true, "from": "userId"}

data: {"status": "online", "userId": "userId"}
```

## Implementation Details
- Imports:
  - `chatManager` from `@/lib/chatManager`
  - `NextResponse` from `next/server`
- Config:
  - `runtime: "nodejs"`
  - `streaming: true`
- Handler steps:
  1. Parse `room` and `user` from query string.
  2. Validate `room` is provided; return error if missing.
  3. Retrieve room instance via `chatManager.getRoom(room)`.
  4. Create a `ReadableStream` with:
     - Initial "connected" event.
     - Keepalive ping every 15 seconds.
     - Event listener for room events.
  5. Stream events to client using TextEncoder.
  6. Clean up on stream cancellation (clear interval, remove listener).
  7. Return Response with appropriate SSE headers.

## SSE Headers
- `Content-Type: text/event-stream`
- `Cache-Control: no-cache, no-transform`
- `Access-Control-Allow-Origin: *`
- `Connection: keep-alive`

## Keepalive Mechanism
- Sends ping event every 15 seconds to prevent connection timeout.
- Prevents proxies or load balancers from closing idle connections.

## Security
- ⚠️ **Note**: This endpoint has no authentication check. Any client can subscribe to any room.
- Consider adding authentication validation if rooms should be private.
- Consider validating `user` parameter if provided.

## Notes
- Clients should implement exponential backoff for reconnection attempts.
- The stream remains open for the duration of the client connection.
- All room events (messages, typing, presence, read) are forwarded through this stream.
- This is a long-lived connection; consider connection limits and timeouts.
