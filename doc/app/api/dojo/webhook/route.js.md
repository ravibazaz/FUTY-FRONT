# POST /api/dojo/webhook

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/dojo/webhook/route.js`

## HTTP Method

POST

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

- `import { connectDB } from "@/lib/db";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`
- `import crypto from "crypto";`
- `import { NextResponse } from "next/server";`

## Notes
