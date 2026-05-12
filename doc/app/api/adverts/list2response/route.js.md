# GET /api/adverts/list2response

## Purpose
Fetches a random selection of currently active adverts configured for Manager or Friendly pages.
This endpoint is useful for showing featured adverts that are valid for the current date range.

## File Location
`app/api/adverts/list2response/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Reads optional query parameter `q` from the request URL.
- Uses MongoDB aggregation to:
  - match adverts with `pages` containing `Manager` or `Friendly`
  - ensure `startAt <= now <= endAt`
  - select 2 random documents with `$sample`
  - project a limited field set for API response
- Returns a JSON object containing a success flag, message, and advert data.

## Query Parameters
- `q` (optional) — search term placeholder (currently unused in aggregation)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Advertisement  List!",
  "data": [
    {
      "_id": "...",
      "name": "...",
      "image": "...",
      "link": "...",
      "content": "...",
      "date": "...",
      "time": "...",
      "end_date": "...",
      "end_time": "...",
      "pages": ["Manager", "Friendly"]
    }
  ]
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `connectDB` from `@/lib/db`
  - `Adverts` model from `@/lib/models/Adverts`
- Aggregation pipeline:
  1. `$match` on `pages` and active date range
  2. `$sample` with `size: 2`
  3. `$project` selected advertisement fields
- Uses `new Date()` to compare current date/time against advert validity window.

## Notes
- The `q` query parameter is parsed but not currently applied to the aggregation filter.
- The endpoint returns up to 2 random adverts, making it ideal for featured ad slots.
- If additional filtering or pagination is required, the aggregation pipeline must be extended.

