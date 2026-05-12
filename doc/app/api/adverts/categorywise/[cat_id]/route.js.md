# GET /api/adverts/categorywise/[cat_id]

## Purpose
Returns store products filtered by a specific category, with optional title search.
This endpoint is used for category-based product browsing and search within categories.

## File Location
`app/api/adverts/categorywise/[cat_id]/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- On success:
  - Extracts the `cat_id` parameter from the URL path.
  - Parses optional query parameter `q` for title search.
  - Builds a query filtering by category ID and optional title regex.
  - Queries the `Stores` collection with the constructed filter.
  - Returns matching store products in a structured response.

## Query Parameters
- `q` (optional) — search term to filter products by title (case-insensitive)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Stores retrieved successfully!",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Premium Football Boots",
      "price": 89.99,
      "description": "High-quality football boots...",
      "image": "/uploads/stores/football-boots.jpg",
      "category": "Equipment",
      "size": ["8", "9", "10", "11"],
      "color": ["Black", "White"],
      "stock": 25,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Training Cones Set",
      "price": 24.99,
      "description": "Professional training cones...",
      "image": "/uploads/stores/training-cones.jpg",
      "category": "Equipment",
      "stock": 50,
      "isActive": true
    }
  ]
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
  - `connectDB` from `@/lib/db`
  - `Stores` model from `@/lib/models/Stores`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if authentication fails.
  2. Extract `cat_id` from URL parameters.
  3. Parse URL search parameter `q`.
  4. Build query object with category filter and optional title regex.
  5. Call `await connectDB()`.
  6. Execute `Stores.find(query).lean()`.
  7. Return success response with filtered store data.

## Security
- Requires valid authentication.
- Protected by the `protectApiRoute` middleware.

## Notes
- **Architectural Note**: Despite being located in the `/api/adverts/` path, this endpoint returns data from the `Stores` collection, not the `Adverts` collection. This appears to be a design inconsistency where store products are accessed through the adverts API namespace.
- The search is case-insensitive and matches partial titles.
- No pagination applied—returns all matching results within the category.
- Uses `.lean()` for performance optimization on read-only operations.`

## Notes

- This endpoint is protected and requires valid authentication.