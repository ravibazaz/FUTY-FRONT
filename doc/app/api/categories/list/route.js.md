# GET /api/categories/list

## Purpose

Returns paginated top-level categories for authenticated users.

## File Location

`app/api/categories/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Reads category data from the `Categories` collection.

## Query Parameters

- `q`
- `page`
- `limit`

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "pagination": { ... }
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Categories from "@/lib/models/Categories";`

## Notes

- This endpoint is protected and requires valid authentication.
- Supports pagination and optional search filters.