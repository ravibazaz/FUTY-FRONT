
# GET /api/tournaments

## Purpose

Returns all tournaments.

## File Location

`app/api/tournaments/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB.
- Returns all documents from the `Tournaments` collection.

## Response

```json
{
  "tournaments": [
    {
      "_id": "string",
      "name": "string",
      "date": "string",
      "closing_date": "string"
    }
  ]
}
```

## Notes

- Public endpoint.
