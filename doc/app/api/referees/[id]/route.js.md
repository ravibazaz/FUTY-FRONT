
# GET /api/referees/[id]

## Purpose

Returns detailed information for a single referee by ID.

## File Location

`app/api/referees/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Extracts the referee ID from the path parameter.
- Retrieves the referee document by ID and populates the associated team, club, and league.
- Returns the detailed referee record.

## Path Parameters

- `id`: Referee user document ID

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Referee Details!",
  "data": {
    "_id": "string",
    "name": "string",
    "surname": "string",
    "referee_lavel": "string",
    "referee_fee": "number",
    "team_id": {
      "_id": "string",
      "name": "string",
      "club": {
        "_id": "string",
        "name": "string",
        "league": {
          "_id": "string",
          "label": "string"
        }
      }
    }
  }
}
```

## Security Notes

- Protected endpoint.
- Returns a single referee record with populated relations.
