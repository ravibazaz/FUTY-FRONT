# POST /api/notifications/read

## Purpose

Mark a single notification as read.

## File Location

`app/api/notifications/read/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the request with `protectApiRoute(req)`.
- Reads JSON payload from the request body.
- Updates the specified `Notification` document by `_id`.
- Sets `isRead` to `true` and sets `readAt` to the current timestamp.
- Returns a success message.

## Request Body

- JSON object containing:
  - `id` (required): ID of the notification to mark read.

## Response Example

```json
{
  "success": true,
  "message": "Successfully read"
}
```

## Implementation Notes

- The route does not validate whether the notification belongs to the authenticated user.
- It uses `findByIdAndUpdate` to apply the status change.

## Imports

- `import Notification from "@/lib/models/Notification";`
- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`

## Notes

- This endpoint is protected and requires authentication.
- It is intended for marking individual notifications read.