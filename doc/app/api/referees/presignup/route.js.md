# app/api/referees/presignup/route.js

## Description

This route handles `GET` requests for pre-signup referee accounts.
It connects to the MongoDB database and returns all `Users` documents where:
- `account_type` is `Referee`
- `user_type` is `presignup`

## Implementation Details

- Imports `connectDB` from `@/lib/db` to establish a database connection.
- Imports the `Users` Mongoose model from `@/lib/models/Users`.
- Defines an async `GET(req)` function.
- Calls `await connectDB()` before querying the database.
- Uses `Users.find(...)` to filter users with:
  - `account_type: "Referee"`
  - `user_type: "presignup"`
- Returns the results as JSON with `Response.json({ referees })`.

## Route Behavior

- Method: `GET`
- Response: JSON object containing a `referees` array.

## Example Response

```json
{
  "referees": [
    {
      "_id": "642d8c9f1b2c3a4567890abc",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "account_type": "Referee",
      "user_type": "presignup",
      "createdAt": "2026-06-09T00:00:00.000Z",
      "updatedAt": "2026-06-09T00:00:00.000Z"
    }
  ]
}
```

## Notes

- This route is read-only and used for listing pending referee preregistrations.
- Any additional filtering, pagination, or authorization would need to be added separately.
