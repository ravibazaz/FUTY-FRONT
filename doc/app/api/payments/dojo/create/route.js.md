# POST /api/payments/dojo/create

## Purpose

Create a Dojo payment intent for a tournament entry order.

## File Location

`app/api/payments/dojo/create/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Uses `protectApiRoute(req)` to validate the authenticated user.
- Reads `tournament_Id` from the JSON request body.
- Fetches tournament pricing from the `Tournaments` collection.
- Creates a pending `TournamentOrderHistories` record.
- Calls the external Dojo payment API at `process.env.DOJO_BASE_URL/payment-intents`.
- Sends the amount in minor units and `currencyCode: 'GBP'`.
- Stores the returned `paymentIntentId` on the order.
- Returns the Dojo `clientSessionSecret`, order ID, and `paymentIntentId`.

## Request Body

- JSON object containing:
  - `tournament_Id` (required): the tournament being paid for

## Response Example

```json
{
  "success": true,
  "message": "Payment Intent generated",
  "data": {
    "clientSecret": "...",
    "orderId": "...",
    "paymentIntentId": "..."
  }
}
```

## Implementation Notes

- The route uses Basic auth with `process.env.DOJO_SECRET_KEY` for the Dojo API.
- It stores the Dojo payment session ID on the order record.
- Errors return a JSON response with HTTP status `400`.

## Imports

- `import { connectDB } from "@/lib/db";`
- `import { NextResponse } from "next/server";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import Tournaments from "@/lib/models/Tournaments";`

## Notes

- This endpoint is protected and requires authentication.
- It is optimized for Dojo payment integration rather than Stripe.