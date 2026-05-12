# POST /api/tournamentaccepted/add

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/tournamentaccepted/add/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Reads form data from the request.
- Returns structured JSON response to the client.
- Looks up a specific document by its ID.

## Query Parameters

- None

## Request Body

- FormData body

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
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import { z } from "zod";`
- `import { v4 as uuidv4 } from "uuid";`
- `import path from "path";`
- `import { promises as fs } from "fs";`
- `import TournamentAccepted from "@/lib/models/TournamentAccepted";`
- `import { log } from "console";`
- `import { createAndSendNotification } from "@/lib/notify";`
- `import Tournaments from "@/lib/models/Tournaments";`

## Notes

- This endpoint is protected and requires valid authentication.