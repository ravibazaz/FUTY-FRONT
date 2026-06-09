**Title:** Players Signup API (GET /api/players/signup)

## Overview

This endpoint returns all player records that have completed signup and are marked with `user_type: "signup"`. It is used by admin interfaces and dashboards that need to display fully registered players separately from pre-signup players.

Implementation: [app/api/players/signup/route.js](app/api/players/signup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/players/signup`
- Auth: public-facing route, intended for internal/admin usage
- Response: JSON

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Player"`
  - `user_type: "signup"`
- Returns the matching players as `{ players }`.

## Example Response

```json
{
  "players": [
    {
      "_id": "64123abc...",
      "name": "Jane Player",
      "email": "jane.player@example.com",
      "telephone": "07123456789",
      "account_type": "Player",
      "user_type": "signup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route reuses the `Users` model from `@/lib/models/Users`.
- It does not implement pagination, filtering, sorting, or access control.
- For production use, consider adding authorization, query limits, and error handling.

*Document generated from the `app/api/players/signup/route.js` implementation.*