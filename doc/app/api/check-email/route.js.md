# GET /api/check-email

## Purpose

Checks whether an email is already registered.

## File Location

`app/api/check-email/route.js`

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

## Notes
