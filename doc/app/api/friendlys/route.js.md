# GET /api/friendlys

## Purpose

Retrieve all friendly match requests from the database.

## File Location

`app/api/friendlys/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Calls `connectDB()` to ensure a MongoDB connection.
- Uses the `Friendlies` Mongoose model to query all friendly documents.
- Returns a JSON object with the raw `friendlies` array.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "friendlies": [
    {
      "_id": "...",
      "name": "Weekend Friendly",
      "date": "2026-05-15",
      "time": "14:00",
      "ground_id": "...",
      "team_id": "...",
      "manager_id": "...",
      "league_id": "...",
      "created_by_user": "..."
    }
  ]
}
```

## Implementation Notes

- The endpoint uses `Response.json(...)` instead of `NextResponse`.
- No filter, pagination, or population is applied; it returns the raw documents from `Friendlies`.
- If the underlying collection has many records, this endpoint may return a large payload.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Friendlies from '@/lib/models/Friendlies';`

## Notes

- This route is intentionally public and does not perform authorization.
- Consumers should handle large result sets carefully.
