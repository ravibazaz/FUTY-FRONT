# POST /api/users/playerinvitationcodecheck

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/users/playerinvitationcodecheck/route.js`

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

- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import { z } from "zod";`
- `import PlayerInvitations from "@/lib/models/PlayerInvitations";`

## Notes
