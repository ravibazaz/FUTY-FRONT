# GET /api/change-status

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/change-status/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Looks up a specific document by its ID.

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

## Notes
