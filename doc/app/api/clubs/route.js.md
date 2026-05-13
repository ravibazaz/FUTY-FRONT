# GET /api/clubs

## Purpose
Returns the full list of club records in the FUTY system.
This endpoint is used to retrieve all clubs, typically for administrative dashboards and public listings.

## File Location
`app/api/clubs/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB through `connectDB()`.
- Queries the `Clubs` collection for all documents.
- Returns club records in a JSON payload.
- No pagination, filtering, or authentication is enforced.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "clubs": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "name": "City United",
      "image": "/uploads/clubs/city-united.jpg",
      "secretary_name": "Jane Doe",
      "league": "6432f88f1e197c1d8a1b4d31",
      "createdAt": "2024-02-10T08:00:00.000Z",
      "updatedAt": "2024-02-10T08:00:00.000Z"
    }
  ]
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Clubs` model from `@/lib/models/Clubs`
  - `Grounds` model from `@/lib/models/Grounds` (currently imported but unused)
- Handler steps:
  1. Call `await connectDB()`.
  2. Execute `Clubs.find()`.
  3. Return `Response.json({ clubs })`.

## Notes
- The `Grounds` import is present in source code but not used in this handler.
- This endpoint returns all clubs without any search or pagination support.
- For large datasets, consider adding filtering and pagination in the future.
