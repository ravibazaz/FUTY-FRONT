
# GET /api/referees/list

## Purpose

Retrieves a paginated list of referees with optional name search and team/club/league population.

## File Location

`app/api/referees/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Parses `q`, `page`, and `limit` from query parameters.
- Queries `Users` for referees and optionally filters by name using case-insensitive regex.
- Populates each referee's `team_id` and nested `club` and `league` relations.
- Returns paginated results and metadata.

## Query Parameters

- `q` (optional): text search on referee `name`
- `page` (optional): page number, default `1`
- `limit` (optional): items per page, default `10`

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Referees List!",
  "data": [
    {
      "_id": "string",
      "profile_image": "string",
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
  ],
  "pagination": { "total": 20, "page": 1, "limit": 10, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false }
}
```

## Implementation Details

- Uses `.lean()` for performance.
- Sorts results by `_id` descending.

## Security Notes

- Protected route returning detailed referee data.
