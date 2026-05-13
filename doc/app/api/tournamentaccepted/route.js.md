
# GET /api/tournamentaccepted

## Purpose

Returns all accepted tournament records with related tournament and accepting user details.

## File Location

`app/api/tournamentaccepted/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB.
- Loads all `TournamentAccepted` documents.
- Populates `tournament_id` and `accepted_by_user.name`.
- Excludes Mongoose `__v` metadata.

## Response

```json
{
  "success": true,
  "message": "Welcome to the Tournament Accepted List!",
  "data": [
    {
      "_id": "string",
      "tournament_id": { "_id": "string", "name": "string" },
      "accepted_by_user": { "_id": "string", "name": "string" }
    }
  ]
}
```

## Notes

- Returns all accepted tournaments without pagination.
