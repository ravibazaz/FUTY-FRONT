
# GET /api/teams/list/[club_id]/[ageGroupId]

## Purpose

Returns teams filtered by club or league and age group.

## File Location

`app/api/teams/list/[club_id]/[ageGroupId]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads `club_id` and `ageGroupId` from path parameters.
- If `type=club`, returns teams in the club for the given age group.
- If `type=league`, returns teams in the league for the age group using aggregation.
- Supports optional search via `q`.

## Path Parameters

- `club_id`
- `ageGroupId`

## Query Parameters

- `type` (required): `club` or `league`
- `q` (optional)

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Team list by club id and age group id!",
  "data": [ /* team objects */ ]
}
```

## Notes

- Protected endpoint.
