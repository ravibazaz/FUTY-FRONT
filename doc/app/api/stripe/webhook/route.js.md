# POST /api/stripe/webhook

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/stripe/webhook/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Looks up a specific document by its ID.

## Query Parameters

- None

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

- `import Stripe from "stripe";`
- `import { connectDB } from "@/lib/db";`
- `import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";`

## Notes
