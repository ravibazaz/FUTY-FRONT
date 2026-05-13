# POST /api/dojo/webhook

## Purpose
Handles incoming webhook notifications from the Dojo payments service.
This endpoint validates webhook signatures, parses Dojo event payloads, and routes payment events for backend processing.

## File Location
`app/api/dojo/webhook/route.js`

## HTTP Method
POST

## Authentication Required
No

## Behavior
- Reads the raw request body as text.
- Extracts the `dojo-signature` header from the request.
- Computes an HMAC-SHA256 signature using `DOJO_WEBHOOK_SECRET`.
- Compares the computed signature against the incoming header using `crypto.timingSafeEqual()`.
- Rejects the webhook if the signature is missing or invalid.
- Parses the verified JSON payload and handles event types.
- Responds with `{ received: true }` on success, which Dojo accepts as acknowledgment.

## Query Parameters
- None

## Request Body
- Raw JSON payload from Dojo webhook

## Expected Headers
- `dojo-signature` (required) — HMAC signature provided by Dojo for webhook verification

## Response Example
```json
{
  "received": true
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `TournamentOrderHistories` from `@/lib/models/TournamentOrderHistories`
  - `crypto` from Node.js
  - `NextResponse` from `next/server`
- Handler steps:
  1. Read raw request body via `await req.text()`.
  2. Validate presence of `dojo-signature` header.
  3. Compute HMAC-SHA256 signature using `process.env.DOJO_WEBHOOK_SECRET`.
  4. Compare signatures securely with `crypto.timingSafeEqual()`.
  5. Parse the JSON payload after verification.
  6. Handle supported event types (`payment_intent.status_updated`, `payment_intent.created`, etc.).
  7. Return success response with status 200.

## Supported Event Types
- `payment_intent.status_updated` — intended to update payment/order record status
- `payment_intent.created` — indicates a new payment intent was created
- Other events are logged as unhandled by default

## Security
- Validates the webhook payload using HMAC signature verification.
- Uses `crypto.timingSafeEqual()` to prevent timing attacks.
- Requires `DOJO_WEBHOOK_SECRET` environment variable to be configured.

## Notes
- The current implementation includes a TODO for order status updates in the database.
- Any unhandled event types are logged but do not generate an error response.
- If webhook verification fails, the endpoint returns `{ error: "Invalid signature" }`.
- This endpoint runs in the Node.js runtime as required for raw body handling.
