# GET /api/managers/list/[league_id]

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/managers/list/[league_id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Uses MongoDB aggregation for advanced filtering.

## Query Parameters

- `q`
- `page`
- `limit`

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
- `import Users from '@/lib/models/Users';`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import mongoose from "mongoose";`

## Notes

- This endpoint is protected and requires valid authentication.