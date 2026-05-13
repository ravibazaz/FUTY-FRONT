# POST /api/friendlys/updatescore

## Purpose

Update score details for a friendly match after acceptance.

## File Location

`app/api/friendlys/updatescore/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the user with `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Parses JSON payload from the request.
- Verifies the authenticated user exists in the `Users` collection.
- Updates the friendly document by `_id` with:
  - `created_by_user_score`
  - `accepted_by_user_score`
- Returns a JSON success response.

## Request Body

- JSON object containing:
  - `_id`: ID of the friendly document
  - `created_by_user_score`: score value for the creator
  - `accepted_by_user_score`: score value for the acceptor

## Response Example

Success:

```json
{
  "success": true,
  "message": "Friendly Score Updated"
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

- There is no validation on the score values; the request body is trusted as-is.
- The endpoint does not confirm whether the current user is related to the friendly.
- It only updates score fields on the target friendly document.

## Imports

- `import { NextResponse } from "next/server";`
- `import { connectDB } from "@/lib/db";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Users from "@/lib/models/Users";`

## Notes

- This route is protected and requires authentication.
- Score updates are applied directly without range checking.