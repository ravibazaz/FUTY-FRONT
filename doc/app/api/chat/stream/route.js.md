# GET /api/chat/stream

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/chat/stream/route.js`

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

- `import { chatManager } from "@/lib/chatManager";`
- `import { NextResponse } from "next/server";`

## Notes
