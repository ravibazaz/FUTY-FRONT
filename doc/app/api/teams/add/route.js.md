
# GET /api/teams/add

## Purpose

Returns available teams that are not assigned to any user.

## File Location

`app/api/teams/add/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Finds all team IDs already referenced by `Users.team_id`.
- Returns teams whose `_id` is not included in the used team list.
- Populates `ground` and club/league information.

## Query Parameters

- `selectedTeam` (optional): current team selection; logged but not used for filtering.

## Request Body

None

## Response

```json
{
  "teams": [
    {
      "_id": "string",
      "name": "string",
      "ground": { "_id": "string", "name": "string" },
      "club": {
        "_id": "string",
        "name": "string",
        "league": { "_id": "string", "label": "string", "title": "string" }
      }
    }
  ]
}
```

## Notes

- Public endpoint.
