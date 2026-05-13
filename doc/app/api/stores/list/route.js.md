
# GET /api/stores/list

## Purpose

Returns a searchable list of store products for authenticated users.

## File Location

`app/api/stores/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Parses `q` from query parameters.
- Returns store products whose title matches the search term.

## Query Parameters

- `q` (optional): title search term

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Store List!",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "image": "string",
      "price": 123
    }
  ]
}
```

## Notes

- Protected endpoint.
