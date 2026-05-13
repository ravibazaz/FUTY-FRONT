# GET /api/clubs/list

## Purpose
Returns a paginated list of clubs for authenticated users.
This endpoint is optimized for admin interfaces and club management UIs.

## File Location
`app/api/clubs/list/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)`.
- Returns authentication error if the user is not authenticated.
- Connects to MongoDB using `connectDB()`.
- Parses optional query parameters: `q` for search, `page`, and `limit` for pagination.
- Builds a query optionally filtering club names by case-insensitive partial match.
- Counts total matching clubs.
- Retrieves paginated results, selecting only `name`, `image`, and `secretary_name`.
- Excludes Mongoose `__v` field.
- Returns paginated club data with metadata.

## Query Parameters
- `q` (optional) — search term to filter clubs by name
- `page` (optional) — page number (default: 1)
- `limit` (optional) — items per page (default: 10)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Club List!",
  "data": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "name": "City United",
      "image": "/uploads/clubs/city-united.jpg",
      "secretary_name": "Jane Doe"
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
  - `connectDB` from `@/lib/db`
  - `Clubs` model from `@/lib/models/Clubs`
- Handler steps:
  1. Authenticate using `protectApiRoute(req)`.
  2. Connect to the database.
  3. Parse `q`, `page`, and `limit`.
  4. Build search query if `q` is present.
  5. Count total matching documents.
  6. Fetch paginated clubs sorted by newest first.
  7. Return response with data and pagination.

## Notes
- `page` and `limit` default to `1` and `10`.
- Search is case-insensitive and matches partial club names.
- This endpoint is protected and requires a valid authenticated session.