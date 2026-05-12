# POST /api/payments/dojo/create

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/payments/dojo/create/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Reads JSON request body with `await req.json()`.
- Returns structured JSON response to the client.
- Looks up a specific document by its ID.

## Query Parameters

- None

## Request Body

- Request JSON body

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": ...
}
```

## Imports

- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Tournaments from "@/lib/models/Tournaments";`

## Notes

- This endpoint is protected and requires valid authentication.