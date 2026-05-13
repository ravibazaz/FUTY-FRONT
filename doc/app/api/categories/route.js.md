# GET /api/categories

## Purpose
Returns all active categories from the FUTY database with parent category details populated.
This endpoint is the primary source for category hierarchy data used across the platform.

## File Location
`app/api/categories/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Queries the `Categories` collection for all documents with `isActive: true`.
- Populates the `parent_cat_id` field to include full parent category metadata.
- Returns all matching category records with parent information.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "categories": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "title": "Equipment",
      "image": "/uploads/categories/equipment.jpg",
      "content": "Sports equipment and gear",
      "isActive": true,
      "parent_cat_id": null,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    },
    {
      "_id": "6432f8901e197c1d8a1b4d30",
      "title": "Footwear",
      "image": "/uploads/categories/footwear.jpg",
      "content": "Boots, shoes, and cleats",
      "isActive": true,
      "parent_cat_id": {
        "_id": "6432f88f1e197c1d8a1b4d2f",
        "title": "Equipment"
      },
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Categories` model from `@/lib/models/Categories`
- Handler steps:
  1. Call `await connectDB()`.
  2. Execute `Categories.find({ isActive: true }).populate("parent_cat_id").lean()`.
  3. Return `Response.json({ categories })`.

## Notes
- This is a public, read-only endpoint—no authentication required.
- Uses `.populate("parent_cat_id")` to include full parent category details.
- Uses `.lean()` for optimized read-only queries.
- Only returns active categories; inactive categories are excluded.