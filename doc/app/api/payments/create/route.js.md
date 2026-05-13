# POST /api/payments/create

## Purpose

Create a Stripe payment intent for a tournament order.

## File Location

`app/api/payments/create/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the authenticated user with `protectApiRoute(req)`.
- Reads `tournament_Id` from the JSON request body.
- Fetches the tournament price from the `Tournaments` collection.
- Creates a pending `TournamentOrderHistories` record with `created_by_user_Id`.
- Creates a Stripe payment intent for the entry fee amount using GBP currency.
- Saves the Stripe `paymentIntentId` on the order record.
- Returns the Stripe `client_secret` and the newly created order ID.

## Request Body

- JSON object containing:
  - `tournament_Id` (required): ID of the tournament being paid for

## Response Example

```json
{
  "success": true,
  "message": "Payment Intent generated",
  "data": {
    "clientSecret": "...",
    "orderId": "..."
  }
}
```

## Implementation Notes

- The amount is derived from `tournamentprice.cost_per_team_entry * 100` and sent to Stripe in minor units.
- The created order is stored with `status: "pending"` before payment completion.
- Errors return a JSON response with HTTP status `400`.

## Imports

- `import Stripe from "stripe";`
- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Tournaments from "@/lib/models/Tournaments";`

## Notes

- This route requires authentication and uses Stripe for payment intent creation.