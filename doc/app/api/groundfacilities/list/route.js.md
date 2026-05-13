# GET /api/groundfacilities/list

## Purpose

Return a protected list of ground facilities, optionally filtered by search.

## File Location

`app/api/groundfacilities/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the current user using `protectApiRoute(req)`.
- Connects to MongoDB with `connectDB()`.
- Reads the optional `q` query parameter and applies a case-insensitive partial match on the `facilities` field.
- Returns facility documents with only the `facilities` and `description` fields.
- Sorts results alphabetically by `facilities`.

## Query Parameters

- `q` (optional): substring search term for the `facilities` field.

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Facilities List!",
  "data": [
    {
      "_id": "...",
      "facilities": "Grass Pitch",
      "description": "Full-size grass playing field"
    }
  ]
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import GroundFacilities from "@/lib/models/GroundFacilities";`

## Notes

- This route requires authentication.
- It returns a filtered list of facility documents and does not support pagination.