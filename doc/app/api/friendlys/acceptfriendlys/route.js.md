# POST /api/friendlys/acceptfriendlys

## Purpose

Accept an existing friendly match request and notify the requester.

## File Location

`app/api/friendlys/acceptfriendlys/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the authenticated user with `protectApiRoute(req)`.
- Connects to MongoDB with `connectDB()`.
- Reads JSON payload from the request body.
- Verifies the current user exists in the `Users` collection.
- Updates the friendly record by its `_id`:
  - `accepted_by_user` is set to the current user.
  - `status` is set to `Friendly Accepted`.
  - `accepteddAt` is set to `Date()`.
- Reads the updated friendly and sends a push notification to the original creator if they have an FCM token.
- Returns a JSON success response.

## Request Body

- JSON object containing:
  - `_id`: the friendly match document ID

## Response Example

Success:

```json
{
  "success": true,
  "message": "Friendly accepted"
}
```

Failure if user is missing:

```json
{
  "success": false,
  "message": "User does not exists"
}
```

## Implementation Notes

- The route does not validate whether the friendly request is already accepted.
- Notification dispatch is attempted only when the request originator has an `fcmtoken`.
- The `accepteddAt` field is assigned from `Date()` rather than `new Date()`.

## Imports

- `import { NextResponse } from "next/server";`
- `import { connectDB } from "@/lib/db";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Users from "@/lib/models/Users";`
- `import { createAndSendNotification } from "@/lib/notify";`

## Notes

- This route is protected and requires authentication.
- It updates acceptance state and may trigger a notification to the document creator.