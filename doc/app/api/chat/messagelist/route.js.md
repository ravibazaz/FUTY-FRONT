# GET /api/chat/messagelist

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/chat/messagelist/route.js`

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
- `page`
- `limit`

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

- `import { connectDB } from "@/lib/db";`
- `import Message from "@/lib/models/Message";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Conversation from "@/lib/models/Conversation";`

## Notes

- This endpoint is protected and requires valid authentication.