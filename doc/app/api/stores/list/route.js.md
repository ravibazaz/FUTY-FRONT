# GET /api/stores/list

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/stores/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.

## Query Parameters

- `q`

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
- `import Stores from "@/lib/models/Stores";`

## Notes

- This endpoint is protected and requires valid authentication.
- Supports pagination and optional search filters.