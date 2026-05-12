# POST /api/push/send

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/push/send/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads JSON request body with `await req.json()`.
- Returns structured JSON response to the client.

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

- `import admin from "@/lib/firebaseAdmin";`
- `import { NextResponse } from "next/server";`

## Notes
