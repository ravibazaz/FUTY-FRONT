
# GET /api/vendors

## Purpose

Returns all active vendors.

## File Location

`app/api/vendors/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB.
- Queries `Vendors` where `isActive` is true.
- Returns the matching vendor list.

## Response

```json
{
  "adverts": [
    {
      "_id": "string",
      "name": "string",
      "isActive": true
    }
  ]
}
```

## Notes

- Public vendor list endpoint.
