# GET /api/categories/subcategories/[id]

## Purpose
Returns all subcategories (child categories) for a given parent category ID.
This endpoint is used for hierarchical category browsing and populating nested category selections.

## File Location
`app/api/categories/subcategories/[id]/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- Extracts the parent category ID from the URL path parameter.
- Connects to MongoDB via `connectDB()`.
- Parses optional query parameter `q` for title search.
- Builds a query to find categories matching:
  - Optional title search (case-insensitive regex) if `q` is provided.
  - Exact `parent_cat_id` matching the path ID.
- Returns matching subcategories with selected fields.

## Query Parameters
- `q` (optional) — search term to filter subcategories by title (case-insensitive)

## URL Parameters
- `id` (required) — the parent category ID to fetch subcategories for

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Sub Categories List by main category Id",
  "data": [
    {
      "_id": "6432f8901e197c1d8a1b4d30",
      "title": "Footwear",
      "image": "/uploads/categories/footwear.jpg",
      "content": "Boots, shoes, and cleats",
      "parent_cat_id": "6432f88f1e197c1d8a1b4d2f"
    },
    {
      "_id": "6432f8911e197c1d8a1b4d32",
      "title": "Protective Gear",
      "image": "/uploads/categories/gear.jpg",
      "content": "Pads, shin guards, and safety",
      "parent_cat_id": "6432f88f1e197c1d8a1b4d2f"
    }
  ]
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
  2. Extract `id` from dynamic route parameter via `(await params).id`.
  3. Call `await connectDB()`.
  4. Parse optional `q` search parameter from query string.
  5. Build query with optional title regex filter and exact `parent_cat_id` match.
  6. Execute `Categories.find(query, "title image content parent_cat_id").lean()`.
  7. Return success response with filtered subcategories.

## Field Selection
- Returns only: `title`, `image`, `content`, `parent_cat_id`

## Security
- Requires valid authentication via `protectApiRoute`.
- Protected endpoint for authenticated users only.

## Notes
- Search is case-insensitive and matches partial titles.
- No pagination applied—returns all matching subcategories.
- Uses `.lean()` for performance optimization on read-only operations.
- Filters only children with `parent_cat_id` matching the provided ID.