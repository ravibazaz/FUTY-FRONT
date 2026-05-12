# GET /api/adverts

## Purpose
Returns all currently active adverts from the FUTY database.
This endpoint is the primary data source for displaying active advertisements across the platform.

## File Location
`app/api/adverts/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB using `connectDB()`.
- Queries the `Adverts` collection for all documents with `isActive: true`.
- Returns all matching advert records in JSON format.
- No pagination or filtering applied.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "adverts": [
    {
      "_id": "...",
      "name": "Summer Tournament 2024",
      "image": "/uploads/adverts/...",
      "isActive": true,
      "startAt": "2024-05-01T00:00:00Z",
      "endAt": "2024-08-31T23:59:59Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ... more active adverts
  ]
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Adverts` model from `@/lib/models/Adverts`
- Handler steps:
  1. Call `await connectDB()` to establish database connection.
  2. Execute `Adverts.find({ isActive: true })`.
  3. Return `Response.json({ adverts })`.

## Notes
- This is a public endpoint—no authentication required.
- Returns all active adverts without pagination or search filtering.
- Useful for fetching adverts for public-facing pages and admin dashboards.
