# GET /api/players

## Purpose

Retrieves a list of all users with account type "Player" from the database.

## File Location

`app/api/players/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Establishes database connection using `connectDB()`.
- Queries the `Users` collection for all documents where `account_type` equals "Player".
- Returns the results as a JSON array of player objects.

## Query Parameters

None

## Request Body

None

## Response

### Success Response (200)

```json
{
  "players": [
    {
      "_id": "string",
      "name": "string",
      "surname": "string",
      "email": "string",
      "account_type": "Player",
      "profile_image": "string",
      // ... other user fields
    }
  ]
}
```

### Error Responses

- **500 Internal Server Error**: Database connection or query failure

## Implementation Details

- Uses Mongoose `Users.find()` with filter `{ account_type: "Player" }`.
- Returns raw player objects without population of related data.
- No pagination implemented - returns all matching players.

## Security Notes

- Public endpoint with no authentication required.
- Returns potentially sensitive user data - consider if this should be protected.

## Usage Notes

- This endpoint provides basic player listing without detailed relationships.
- For paginated, searchable, or populated player data, use `/api/players/list` instead.
