
# GET /api/teams

## Purpose

Returns all teams with populated ground and nested club/league information.

## File Location

`app/api/teams/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database.
- Finds all `Teams` documents.
- Populates `ground` and `club` with nested `league` data.
- Returns the list of teams.

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
        "league": {
          "_id": "string",
          "label": "string",
          "title": "string"
        }
      }
    }
  ]
}
```

## Notes

- Public endpoint using `.lean()` for performance.
