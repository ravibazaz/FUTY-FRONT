# GET /api/players/[id]

## Purpose

Retrieves detailed information for a specific player by their ID, including populated manager, team, club, and league data.

## File Location

`app/api/players/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes - Requires valid authentication via `protectApiRoute(req)`.

## Behavior

- Validates user authentication and returns error if unauthorized.
- Extracts player ID from URL parameters.
- Queries the `Users` collection for the specific player by ID.
- Populates related data: manager → team → club → league.
- Returns detailed player information with organizational hierarchy.

## Query Parameters

None (ID is extracted from URL path)

## Request Body

None

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "Welcome to the Player details!",
  "data": {
    "_id": "string",
    "name": "string",
    "surname": "string",
    "email": "string",
    "account_type": "Player",
    "profile_image": "string",
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
    // ... other user fields excluding __v
  }
}
```

### Error Responses

- **401 Unauthorized**: Invalid or missing authentication
- **404 Not Found**: Player with specified ID not found
- **500 Internal Server Error**: Database connection or query failure

## Implementation Details

- Uses Mongoose `findById()` to retrieve specific player document.
- Applies `.select("-__v")` to exclude MongoDB version field from response.
- Uses deep population to fetch complete organizational hierarchy.
- Uses `.lean()` for performance optimization.
- Returns single player object (not array) in data field.

## Security Notes

- Protected endpoint requiring authentication.
- Returns detailed player and organizational information.
- No authorization checks for viewing other players' data.

## Usage Notes

- Use for player detail/profile views in admin or management interfaces.
- Provides complete context including team, club, and league affiliations.
- Suitable for player profile pages or detailed listings.