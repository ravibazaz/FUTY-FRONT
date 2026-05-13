# GET /api/clubs/[id]

## Purpose
Returns detailed data for a single club by ID.
This endpoint is used for club detail views in authenticated areas such as admin panels.

## File Location
`app/api/clubs/[id]/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)`.
- Returns authentication error if the user is not authenticated.
- Extracts the club ID from the dynamic route parameter.
- Connects to MongoDB via `connectDB()`.
- Queries `Clubs.findById(id)` and populates the `league` reference.
- Excludes the Mongoose `__v` version field.
- Returns the club record in a structured response.

## URL Parameters
- `id` (required) — the club ID to retrieve

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Club Details",
  "data": {
    "_id": "6432f88f1e197c1d8a1b4d2f",
    "name": "City United",
    "image": "/uploads/clubs/city-united.jpg",
    "secretary_name": "Jane Doe",
    "league": {
      "_id": "6432f88f1e197c1d8a1b4d31",
      "name": "Premier League"
    }
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
  1. Authenticate with `protectApiRoute(req)`.
  2. Extract `id` from the route params.
  3. Call `await connectDB()`.
  4. Execute `Clubs.findById(id).select('-__v').populate('league').lean()`.
  5. Return success response with club details.

## Security
- Requires a valid authenticated session.
- Protects club detail access from anonymous users.

## Notes
- Uses `.lean()` for read-only performance.
- Populates league metadata for richer club details.
- If the club ID is invalid, the response may contain `data: null`.