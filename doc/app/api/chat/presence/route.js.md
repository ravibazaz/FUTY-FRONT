# POST /api/chat/presence

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/chat/presence/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads JSON request body with `await req.json()`.

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

## Notes
