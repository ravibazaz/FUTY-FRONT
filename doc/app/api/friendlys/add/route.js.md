# POST /api/friendlys/add

## Purpose

Create a new friendly match request for the authenticated user.

## File Location

`app/api/friendlys/add/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Uses `protectApiRoute(req)` to validate the authenticated user.
- Parses multipart `FormData` from the request.
- Converts form entries into a plain object and collects any `images` fields.
- Validates required fields using the `TournamentSchema` Zod schema.
- Creates a new `Friendlies` document with `created_by_user` set to the current user.
- Returns a JSON success/failure response.

## Request Body

- Multipart `FormData`
- Required fields:
  - `name`: Friendly title
  - `date`: Date string
  - `time`: Time string
  - `description`: Description string
  - `ground_id`: Ground object ID
  - `team_id`: Team object ID
  - `manager_id`: Manager object ID
  - `league_id`: League object ID
- Optional field:
  - `images`: one or more file entries (currently parsed but not persisted in the implementation)

## Response Example

Success:

```json
{
  "success": true,
  "message": "Successfully added friendlys!"
}
```

Validation error:

```json
{
  "success": false,
  "message": {
    "name": "Friendly Title is required",
    "date": "Date is required"
  }
}
```

## Implementation Notes

- The schema currently validates text fields only; image handling is present in commented code and is not active.
- `rawData` is stored directly in the new document alongside `created_by_user`.
- The route returns HTTP 200 for both success and validation/error responses.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import { z } from "zod";`
- `import { v4 as uuidv4 } from "uuid";`
- `import path from "path";`
- `import { promises as fs } from "fs";`

## Notes

- This endpoint is protected and requires authentication.
- The current implementation does not persist uploaded image files.