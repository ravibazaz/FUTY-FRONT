
# GET /api/teams/list/[club_id]

## Purpose

Returns teams for a specific club.

## File Location

`app/api/teams/list/[club_id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads `club_id` from the URL path.
- Returns teams that belong to the club, with club metadata.

## Path Parameters

- `club_id`: club identifier

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Team list by club id List!",
  "data": [ /* team objects */ ]
}
```

## Notes

- Protected endpoint.
