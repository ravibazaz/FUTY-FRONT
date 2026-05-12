# POST /api/users/managerinvitationcodecheck

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/users/managerinvitationcodecheck/route.js`

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
- `import ManagerInvitations from "@/lib/models/ManagerInvitations";`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import AgeGroups from "@/lib/models/AgeGroups";`

## Notes
