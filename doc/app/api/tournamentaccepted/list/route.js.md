
# GET /api/tournamentaccepted/list

## Purpose

Returns all tournament acceptance records with tournament and accepter details.

## File Location

`app/api/tournamentaccepted/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Loads all `TournamentAccepted` documents.
- Populates `tournament_id` and `accepted_by_user.name`.
- Excludes `__v` metadata.

## Response

```json
{
  "success": true,
  "message": "Welcome to the Tournament Accepted List!",
  "data": [/* list of acceptance records */]
}
```

## Notes

- Similar to `/api/tournamentaccepted`, but requires authentication.
