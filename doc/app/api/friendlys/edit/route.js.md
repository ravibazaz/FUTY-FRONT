# POST /api/friendlys/edit

## Purpose

Update an existing friendly match request for the authenticated user.

## File Location

`app/api/friendlys/edit/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Uses `protectApiRoute(req)` to validate the authenticated user.
- Parses multipart `FormData` from the request.
- Converts form entries into a plain object and collects any `images` fields.
- Validates required fields using the `TournamentSchema` Zod schema.
- Updates the `Friendlies` document identified by `_id` using `findOneAndUpdate(...)`.
- Returns a JSON success/failure response.

## Request Body

- Multipart `FormData`
- Required fields (same as add route):
  - `name`
  - `date`
  - `time`
  - `description`
  - `ground_id`
  - `team_id`
  - `manager_id`
  - `league_id`
  - `_id`: ID of the friendly document to update
- Optional field:
  - `images`: one or more file entries (currently parsed but not persisted)

## Response Example

Success:

```json
{
  "success": true,
  "message": "Successfully edited friendlys!"
}
```

Validation error:

```json
{
  "success": false,
  "message": {
    "description": "Description is required"
  }
}
```

## Implementation Notes

- The endpoint updates the document with `rawData._id` and does not currently verify ownership.
- Image handling is present in commented code and remains inactive.
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
- It updates the matching friendly document but does not currently check that the authenticated user owns it.