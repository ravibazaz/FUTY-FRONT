# GET /api/teams/check-club-age

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/teams/check-club-age/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
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
  "data": ...
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import User from "@/lib/models/Users";`
- `import { connectDB } from "@/lib/db";`
- `import Teams from "@/lib/models/Teams";`

## Notes
