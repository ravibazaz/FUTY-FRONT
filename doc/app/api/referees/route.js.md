
# GET /api/referees

## Purpose

Returns a list of all users whose account type is set to `Referee`.

## File Location

`app/api/referees/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB via `connectDB()`.
- Queries the `Users` collection for documents where `account_type` equals `Referee`.
- Returns the full list of referee users.

## Query Parameters

None

## Request Body

None

## Response

```json
{
  "referees": [
    {
      "_id": "string",
      "name": "string",
      "surname": "string",
      "account_type": "Referee",
      "profile_image": "string"
    }
  ]
}
```

## Implementation Details

- Uses `Users.find({ account_type: "Referee" })`.
- Returns raw referee documents without population.

## Notes

- Public endpoint returning referee user records.
