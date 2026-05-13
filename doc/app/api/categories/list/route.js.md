# GET /api/categories/list

## Purpose
Returns a paginated list of top-level categories (those without a parent).
This endpoint supports search filtering and is used for authenticated admin/user category management and browsing.

## File Location
`app/api/categories/list/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Connects to MongoDB via `connectDB()`.
- Parses optional query parameters: `q` (search), `page` (pagination), `limit` (items per page).
- Builds a query to find categories where:
  - Title matches the search term (case-insensitive regex) if `q` is provided.
  - `parent_cat_id` is `null` or does not exist (top-level only).
- Counts total matching documents.
- Executes pagination using `skip()` and `limit()`.
- Sorts results by descending `_id` (newest first).
- Returns category data with pagination metadata.

## Query Parameters
- `q` (optional) — search term to filter categories by title (case-insensitive)
- `page` (optional) — page number for pagination (default: 1)
- `limit` (optional) — items per page (default: 10)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Categories List!",
  "data": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "title": "Equipment",
      "image": "/uploads/categories/equipment.jpg",
      "content": "Sports equipment and gear"
    },
    {
      "_id": "6432f8901e197c1d8a1b4d31",
      "title": "Apparel",
      "image": "/uploads/categories/apparel.jpg",
      "content": "Team uniforms and casual wear"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
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
  - `Categories` model from `@/lib/models/Categories`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if not authenticated.
  2. Call `await connectDB()`.
  3. Parse `q`, `page`, `limit` from query string (with defaults: page=1, limit=10).
  4. Build query for top-level categories with optional title search.
  5. Count total matching documents.
  6. Execute paginated query with sorting.
  7. Return success response with data and pagination metadata.

## Field Selection
- Only returns: `title`, `image`, `content` (excludes `_id` lookup details)

## Security
- Requires valid authentication via `protectApiRoute`.
- Protected endpoint for authenticated users only.

## Notes
- Pagination defaults: page=1, limit=10.
- Search is case-insensitive and matches partial titles.
- Results are sorted by `_id` descending (newest first).
- Top-level categories are identified by `parent_cat_id` being `null` or undefined.