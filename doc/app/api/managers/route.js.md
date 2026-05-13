# GET /api/managers

## Purpose

Retrieve all users whose `account_type` is `Manager`.

## File Location

`app/api/managers/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `Users` collection where `account_type` equals `Manager`.
- Returns a JSON payload containing the raw `managers` array.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "managers": [
    {
      "_id": "...",
      "name": "Jane",
      "surname": "Doe",
      "account_type": "Manager",
      "team_id": "..."
    }
  ]
}
```

## Implementation Notes

- The endpoint is public and does not require authentication.
- It returns unpaginated results for all manager users.
- The handler uses `Response.json(...)` rather than `NextResponse`.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Users from '@/lib/models/Users';`

## Notes

- Clients should paginate or filter results if the manager user set grows large.
