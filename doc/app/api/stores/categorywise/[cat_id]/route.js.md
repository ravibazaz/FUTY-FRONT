
# GET /api/stores/categorywise/[cat_id]

## Purpose

Returns store products for a specific category, with optional title search.

## File Location

`app/api/stores/categorywise/[cat_id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads `cat_id` from the URL path.
- Optionally filters products by title using `q`.
- Returns products matching the category.

## Path Parameters

- `cat_id`: category ID

## Query Parameters

- `q` (optional): search term for product title

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Product Details!",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "image": "string",
      "price": 123,
      "category": "string"
    }
  ]
}
```

## Notes

- Protected endpoint.
