# GET /api/friendlys/list

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/friendlys/list/route.js`

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
  "data": [ ... ],
  "pagination": { ... }
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import Grounds from "@/lib/models/Grounds";`
- `import { getDistance } from "@/lib/geocode";`

## Notes

- This endpoint is protected and requires valid authentication.
- Supports pagination and optional search filters.