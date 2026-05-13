
# POST /api/stripe/webhook

## Purpose

Handles Stripe webhook events and updates tournament order history payment status.

## File Location

`app/api/stripe/webhook/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Reads the raw request body and Stripe signature header.
- Verifies the event using `stripe.webhooks.constructEvent()`.
- Updates `TournamentOrderHistories` status based on event type:
  - `payment_intent.succeeded` → `paid`
  - `payment_intent.payment_failed` → `failed`
  - `payment_intent.canceled` → `canceled`
  - `payment_intent.processing` → `processing`
- Responds with HTTP 200 for valid events or 400 for invalid signatures.

## Security Notes

- Uses Stripe webhook secret from `process.env.STRIPE_WEBHOOK_SECRET`.
- Disables body parsing to preserve the raw request body.

## Response

- **200 OK** for processed webhook events
- **400 Bad Request** for signature verification failures
