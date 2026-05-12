# POST /api/adverts/createorder

## Purpose

Creates a new order history record for a store product after authentication.

## File

`app/api/adverts/createorder/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Protects the route with `protectApiRoute(req)`.
- Reads authenticated `user` from middleware result.
- Parses JSON body from the request.
- Finds the store product using `Stores.findById(product_id)`.
- Copies the existing store image file to a new timestamped filename.
- Creates an `OrderHistories` document with order details and store metadata.
- Returns a success message.

## Request

- JSON request body expected.
- Example required fields:
  - `product_id`
  - `...order data body fields from request JSON`

## Response Example

```json
{
  "success": true,
  "message": "Order created successfully!"
}
```

## Implementation Notes

- `import { NextResponse } from "next/server";`
- `import { connectDB } from "@/lib/db";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import OrderHistories from "@/lib/models/OrderHistories";`
- `import path from "path";`
- `import { promises as fs } from "fs";`
- `import Stores from "@/lib/models/Stores";`
- Copies store image files and stores order history metadata.

## Notes

- Requires authentication and user context.
- Returns simple success JSON only.