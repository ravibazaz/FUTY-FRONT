# GET /api/adverts/list

## Purpose
Returns a filterable list of adverts matching optional search criteria.
This endpoint is used for search and listing pages that need to display adverts with text-based filtering.

## File Location
`app/api/adverts/list/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB using `connectDB()`.
- Reads optional query parameter `q` from the request URL.
- Filters adverts by `name` using case-insensitive regex matching if `q` is provided.
- Selects specific fields: `name`, `image`, `content`, `link`, `date`, `time`, `end_date`, `end_time`, `pages`.
- Returns a structured success response with advert data.

## Query Parameters
- `q` (optional) — search term to filter adverts by name (case-insensitive)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Adverts List!",
  "data": [
    {
      "_id": "...",
      "name": "Youth Cup Finals",
      "image": "/uploads/adverts/...",
      "content": "Join us for the youth cup finals...",
      "link": "https://example.com",
      "date": "2024-06-15",
      "time": "10:00",
      "end_date": "2024-06-15",
      "end_time": "18:00",
      "pages": ["Home", "Dashboard"]
    }
    // ... more matching adverts
  ]
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `connectDB` from `@/lib/db`
  - `Adverts` model from `@/lib/models/Adverts`
- Handler steps:
  1. Call `await connectDB()`.
  2. Parse URL search parameter `q`.
  3. Build query with conditional name regex filter.
  4. Execute `Adverts.find(query, "...fields...").lean()`.
  5. Return `NextResponse.json({ success, message, data })`.

## Notes
- Uses lean() for optimized read-only queries.
- The search is case-insensitive and matches partial names.
- No pagination applied—returns all matching results.