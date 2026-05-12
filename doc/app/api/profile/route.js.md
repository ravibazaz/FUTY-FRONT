# GET /api/profile

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/profile/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Returns structured JSON response to the client.
- Uses MongoDB aggregation for advanced filtering.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": ...
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from "@/lib/db";`
- `import Notification from "@/lib/models/Notification";`
- `import Friendlies from "@/lib/models/Friendlies";`

## Notes

- This endpoint is protected and requires valid authentication.