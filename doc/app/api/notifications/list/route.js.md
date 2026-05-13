# GET /api/notifications/list

## Purpose

Return the authenticated users notification feed with optional search and pagination.

## File Location

`app/api/notifications/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the request using `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Reads optional query parameters `q`, `page`, and `limit`.
- Filters notifications by the current `userId` and a case-insensitive `title` search.
- Sorts notifications by `createdAt` descending.
- Returns paginated results with metadata.

## Query Parameters

- `q` (optional): search string to filter notification titles.
- `page` (optional): page number, defaults to `1`.
- `limit` (optional): number of notifications per page, defaults to `20`.

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "New match invitation",
      "message": "...",
      "isRead": false,
      "createdAt": "2026-05-13T12:34:56.789Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

## Implementation Notes

- The endpoint only returns notifications belonging to the authenticated user.
- The query uses `req.nextUrl.searchParams` to read URL parameters.
- Results are returned in descending order by `createdAt`.

## Imports

- `import Notification from "@/lib/models/Notification";`
- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`

## Notes

- The route supports search and pagination for notification feed rendering.