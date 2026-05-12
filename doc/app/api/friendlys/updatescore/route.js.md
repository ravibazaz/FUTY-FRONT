# POST /api/friendlys/updatescore

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/friendlys/updatescore/route.js`

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

- `import { NextResponse } from "next/server";`
- `import { connectDB } from "@/lib/db";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { z } from "zod";`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Users from "@/lib/models/Users";`

## Notes

- This endpoint is protected and requires valid authentication.