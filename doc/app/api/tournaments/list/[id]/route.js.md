# GET /api/tournaments/list/[id]

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/tournaments/list/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Returns structured JSON response to the client.
- Looks up a specific document by its ID.

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
- `import { connectDB } from '@/lib/db';`
- `import Tournaments from "@/lib/models/Tournaments";`

## Notes

- This endpoint is protected and requires valid authentication.