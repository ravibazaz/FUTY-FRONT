# GET /api/notifications/unread-count

## Purpose

Return the authenticated user's unread notification count.

## File Location

`app/api/notifications/unread-count/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the request using `protectApiRoute(req)`.
- Connects to MongoDB with `connectDB()`.
- Counts unread notifications where `userId` is the current user and `isRead` is `false`.
- Returns the count inside the response message object.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": {
    "count": 7
  }
}
```

## Implementation Notes

- The route returns unread notification count under `message.count`.
- It does not return the notification objects themselves.

## Imports

- `import Notification from "@/lib/models/Notification";`
- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`

## Notes

- This endpoint is protected and intended for client badge/count display.