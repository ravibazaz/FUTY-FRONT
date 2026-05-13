# POST /api/payments/status

## Purpose

Retrieve the status of a tournament payment order.

## File Location

`app/api/payments/status/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Reads `orderId` from the JSON request body.
- Connects to MongoDB using `connectDB()`.
- Finds the `TournamentOrderHistories` record by ID.
- Returns the order status.

## Request Body

- JSON object containing:
  - `orderId` (required): ID of the payment order

## Response Example

```json
{
  "status": "pending"
}
```

## Implementation Notes

- This endpoint does not authenticate the calling user.
- It returns only the `status` field from the order document.
- If the order ID is invalid, the response may contain `null` or throw an error.

## Imports

- `import { connectDB } from "@/lib/db";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`

## Notes

- Because authentication is not enforced, callers should treat this endpoint as public status lookup.
