# POST /api/users/forgetpassword/change-password

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/users/forgetpassword/change-password/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads JSON request body with `await req.json()`.
- Returns structured JSON response to the client.
- Looks up a specific document by its ID.

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

- `import { NextResponse } from "next/server";`
- `import { connectDB } from "@/lib/db";`
- `import { z } from "zod";`
- `import Users from "@/lib/models/Users";`
- `import bcrypt from "bcryptjs";`

## Notes
