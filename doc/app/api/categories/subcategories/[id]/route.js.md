# GET /api/categories/subcategories/[id]

## Purpose

Returns subcategories for a parent category after authentication.

## File Location

`app/api/categories/subcategories/[id]/route.js`

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

## Request Body

- None

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
- `import Categories from "@/lib/models/Categories"`

## Notes

- This endpoint is protected and requires valid authentication.
- Uses the path `id` as `parent_cat_id` to return child categories.