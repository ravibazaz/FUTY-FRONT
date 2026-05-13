# GET /api/notifications/all-read

## Purpose

Mark all unread notifications for the authenticated user as read.

## File Location

`app/api/notifications/all-read/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the user with `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Updates all notifications for the current user where `isRead` is `false`.
- Sets `isRead` to `true` and records `readAt` with the current timestamp.
- Returns a success message.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Successfully read all"
}
```

## Implementation Notes

- This endpoint performs a bulk update across the authenticated user's unread notifications.
- It does not return the updated notification objects.

## Imports

- `import Notification from "@/lib/models/Notification";`
- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`

## Notes

- The route is intended for marking all notifications read with a single request.