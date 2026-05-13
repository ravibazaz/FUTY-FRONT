# GET /api/players/list

## Purpose

Retrieves a paginated, searchable list of players with populated manager, team, club, and league information.

## File Location

`app/api/players/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - Requires valid authentication via `protectApiRoute(req)`.

## Behavior

- Validates user authentication and returns error if unauthorized.
- Parses query parameters for search, pagination, and limits.
- Queries `Users` collection for players with optional name search using regex.
- Populates related data: manager → team → club → league.
- Returns paginated results with metadata.

## Query Parameters

- `q` (optional): Search string for player name (case-insensitive regex match)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

## Request Body

None

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "Welcome to the Player List!",
  "data": [
    {
      "_id": "string",
      "profile_image": "string",
      "name": "string",
      "surname": "string",
      "palyer_manger_id": {
        "_id": "string",
        "name": "string",
        "team_id": {
          "_id": "string",
          "label": "string",
          "name": "string",
          "club": {
            "_id": "string",
            "label": "string",
            "name": "string",
            "league": {
              "_id": "string",
              "label": "string",
              "title": "string"
            }
          }
        }
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Responses

- **401 Unauthorized**: Invalid or missing authentication
- **500 Internal Server Error**: Database connection or query failure

## Implementation Details

- Uses Mongoose population to fetch related manager, team, club, and league data.
- Applies case-insensitive regex search on `name` field when `q` parameter provided.
- Sorts results by `_id` descending (newest first).
- Calculates pagination metadata including total count and page navigation flags.
- Uses `.lean()` for performance optimization.

## Security Notes

- Protected endpoint requiring authentication.
- Returns detailed player and organizational hierarchy information.
- No input validation on query parameters beyond basic parsing.

## Usage Notes

- Use for admin/management interfaces requiring player listings with full context.
- Supports search functionality for finding specific players.
- Pagination helps manage large datasets efficiently.