# POST /api/chat/typing

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/chat/typing/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
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

- `import { chatManager } from "@/lib/chatManager";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`

## Notes

- This endpoint is protected and requires valid authentication.