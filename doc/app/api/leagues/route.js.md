# GET /api/leagues

## Purpose

Retrieve all active league records.

## File Location

`app/api/leagues/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries `Leagues` for documents where `isActive` is `true`.
- Returns a JSON response containing the raw `leagues` array.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "leagues": [
    {
      "_id": "...",
      "title": "Premier League",
      "isActive": true,
      "age_groups": ["..."]
    }
  ]
}
```

## Implementation Notes

- This route does not require authentication.
- The response payload is unpaginated and returns all active leagues.
- The handler uses `Response.json(...)` rather than `NextResponse`.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Leagues from '@/lib/models/Leagues';`

## Notes

- Clients should handle large result sets if many active leagues exist.
