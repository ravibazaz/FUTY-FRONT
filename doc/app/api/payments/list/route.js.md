# GET /api/payments/list

## Purpose

Retrieve tournament payment orders for the authenticated user.

## File Location

`app/api/payments/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the request with `protectApiRoute(req)`.
- Connects to MongoDB with `connectDB()`.
- Queries `TournamentOrderHistories` for orders created by the current user.
- Populates the `tournament_Id` reference for each order.
- Returns the list of payment orders.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Tournament Payment details!",
  "data": [
    {
      "_id": "...",
      "amount": 100,
      "currency": "gbp",
      "status": "pending",
      "tournament_Id": {
        "_id": "...",
        "name": "..."
      }
    }
  ]
}
```

## Implementation Notes

- The endpoint returns all orders for the authenticated user without pagination.
- It uses `.populate('tournament_Id')` to include tournament details.
- No search or filtering is implemented beyond the current user scope.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`

## Notes

- This route is protected and only returns orders belonging to the authenticated user.