
# GET /api/teams/[id]

## Purpose

Returns details for a single team, including club, league, ground, age groups, and manager references.

## File Location

`app/api/teams/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads `id` from the URL path.
- Loads the team and deeply populates related documents.
- Returns the detailed team object.

## Path Parameters

- `id`: team document ID

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Team Detail Page!",
  "data": {
    "_id": "string",
    "name": "string",
    "age_groups": [ { "_id": "string", "age_group": "string" } ],
    "club": { "_id": "string", "name": "string", "league": { "_id": "string", "label": "string", "title": "string" } },
    "ground": { "_id": "string", "name": "string" },
    "managers": [ { "_id": "string", "name": "string", "profile_image": "string" } ]
  }
}
```

## Notes

- Protected endpoint.
