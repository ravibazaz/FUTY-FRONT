# GET /api/adverts/[id]

## Purpose
Returns detailed information for a specific store product by its ID.
This endpoint provides comprehensive product data for individual product views and editing.

## File Location
`app/api/adverts/[id]/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- On success:
  - Extracts the `id` parameter from the URL path.
  - Queries the `Stores` collection for the document with the matching ID.
  - Selects all fields except `__v` (version field).
  - Uses `.lean()` for optimized read-only query.
  - Returns the store product data in a structured response.

## Query Parameters
- None (ID is extracted from URL path)

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Store retrieved successfully!",
  "data": {
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
  }
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
  2. Extract `id` from URL parameters.
  3. Call `await connectDB()`.
  4. Execute `Stores.findById(id).select('-__v').lean()`.
  5. If no store found, return error response.
  6. Return success response with store data.

## Security
- Requires valid authentication.
- Protected by the `protectApiRoute` middleware.

## Notes
- **Architectural Note**: Despite being located in the `/api/adverts/` path, this endpoint returns data from the `Stores` collection, not the `Adverts` collection. This appears to be a design inconsistency where store products are accessed through the adverts API namespace.
- Uses `.lean()` for performance optimization on read-only operations.
- Excludes the MongoDB version field (`__v`) from the response.`

## Notes

- This endpoint is protected and requires valid authentication.