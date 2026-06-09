**Title:** Players Presignup API (GET /api/players/presignup)

## Overview

This endpoint returns all player records currently in the pre-signup state. It is used by admin pages to display players who have registered but are still flagged as `presignup` rather than fully signed up.

Implementation: [app/api/players/presignup/route.js](app/api/players/presignup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/players/presignup`
- Auth: public-facing route, intended for internal/admin usage
- Response: JSON

## Behavior

- Connects to MongoDB with `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Player"`
  - `user_type: "presignup"`
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
      "user_type": "presignup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route reuses the shared `Users` model from `@/lib/models/Users`.
- It does not implement pagination, filtering, sorting, or access control.
- For production use, consider adding authorization, query limits, and error handling.

*Document generated from the `app/api/players/presignup/route.js` implementation.*