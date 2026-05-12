# GET /api/adverts/categorywise/[cat_id]

## Purpose

Returns store items filtered by category ID and optional search query after authentication.

## File

`app/api/adverts/categorywise/[cat_id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Protects the route with `protectApiRoute(req)`.
- Reads authenticated `user` from middleware result.
- Reads path parameter `cat_id` and optional query param `q`.
- Connects to MongoDB using `connectDB()`.
- Filters `Stores` by `category` and by `title` regex when `q` is present.
- Returns matching store records with limited fields.

## Request

- No request body.
- Optional query parameters:
  - `q`

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Product Details!",
  "data": [ /* stores matching category */ ]
}
```

## Implementation Notes

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Stores from "@/lib/models/Stores";`
- Uses `Stores` collection, not `Adverts`, despite the adverts path.

## Notes

- Protected route requiring valid auth token/cookie.
- Useful for authenticated store detail and category filters.