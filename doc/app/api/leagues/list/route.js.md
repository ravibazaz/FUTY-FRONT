# GET /api/leagues/list

## Purpose

Return a protected, paginated list of leagues with optional title search.

## File Location

`app/api/leagues/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the request using `protectApiRoute(req)`.
- Connects to MongoDB via `connectDB()`.
- Reads optional query parameters `q`, `page`, and `limit`.
- Filters leagues by `title` using a case-insensitive regex when `q` is provided.
- Populates `age_groups` for each league.
- Returns league documents and pagination metadata.

## Query Parameters

- `q` (optional): search string for league title.
- `page` (optional): page number, defaults to `1`.
- `limit` (optional): items per page, defaults to `10`.

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the League List!",
  "data": [
    {
      "_id": "...",
      "title": "Premier League",
      "age_groups": [
        { "_id": "...", "age_group": "U18" }
      ]
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Implementation Notes

- The endpoint only returns authenticated results.
- `page` and `limit` are parsed as integers and default to `1` and `10`.
- It sorts results by `_id` descending.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Leagues from "@/lib/models/Leagues";`

## Notes

- This route is designed for authenticated dashboards or admin views.
- Search only applies to the league title field.