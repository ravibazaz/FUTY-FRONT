
# GET /api/stores/[id]

## Purpose

Returns a single store product by its ID.

## File Location

`app/api/stores/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads the product ID from the path parameter.
- Returns the product document without the `__v` field.

## Path Parameters

- `id`: store product ID

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Product Details!",
  "data": {
    "_id": "string",
    "title": "string",
    "price": 123,
    "image": "string",
    "category": "string"
  }
}
```

## Notes

- Protected endpoint.
