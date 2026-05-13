# GET /api/grounds/list

## Purpose

Return a protected, paginated list of grounds with optional name search.

## File Location

`app/api/grounds/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the current user with `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Reads optional query parameters `q`, `page`, and `limit`.
- Filters grounds by `name` when `q` is provided, using a case-insensitive regex.
- Returns `name`, `images`, `add1`, `add2`, and `add3` for each result.
- Provides pagination metadata in the response.

## Query Parameters

- `q` (optional): search string to filter ground names.
- `page` (optional): page number, defaults to `1`.
- `limit` (optional): items per page, defaults to `1000`.

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Ground List!",
  "data": [
    {
      "_id": "...",
      "name": "Central Sports Ground",
      "images": ["/uploads/grounds/1700000000_ab12cd.jpg"],
      "add1": "123 Field Way",
      "add2": "West District",
      "add3": "Cityville"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 1000,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## Implementation Notes

- The endpoint supports large default limits and may return many records if `limit` is not lowered.
- Search only applies to the `name` field.
- It returns HTTP 200 for all valid responses, including empty result sets.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Grounds from "@/lib/models/Grounds";`

## Notes

- This route is protected and intended for authenticated dashboards or admin views.
- The default `limit` of `1000` is large; clients should pass a smaller value for real production use.