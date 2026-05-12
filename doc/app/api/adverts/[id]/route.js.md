# GET /api/adverts/[id]

## Purpose

Returns a single store record by ID after authentication.

## File

`app/api/adverts/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Protects the route with `protectApiRoute(req)`.
- Reads the path parameter `id`.
- Connects to MongoDB using `connectDB()`.
- Queries `Stores.findById(id)` excluding `__v`.
- Returns store details in the response data.

## Request

- No request body.

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Product Details!",
  "data": { /* store data */ }
}
```

## Implementation Notes

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Stores from "@/lib/models/Stores";`
- Uses `Stores` collection, not `Adverts`, for the requested ID.

## Notes

- Protected route requiring valid auth token/cookie.
- Useful for authenticated store detail and category filters.