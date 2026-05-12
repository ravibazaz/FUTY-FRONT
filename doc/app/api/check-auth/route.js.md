# GET /api/check-auth

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/check-auth/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Returns structured JSON response to the client.

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

- `import { isAuthenticated } from "@/lib/auth";`
- `import { NextResponse } from "next/server";`

## Notes
