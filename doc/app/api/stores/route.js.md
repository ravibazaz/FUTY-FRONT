
# GET /api/stores

## Purpose

Retrieves all active store products.

## File Location

`app/api/stores/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database.
- Queries `Stores` for documents where `isActive` is true.
- Returns the matching store products.

## Query Parameters

None

## Request Body

None

## Response

```json
{
  "stores": [
    {
      "_id": "string",
      "title": "string",
      "price": 123,
      "image": "string",
      "category": "string"
    }
  ]
}
```

## Implementation Details

- Uses `Stores.find({ isActive: true })`.

## Notes

- Public endpoint providing active store items.
