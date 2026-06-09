**Title:** Managers Signup API (GET /api/managers/signup)

## Overview

This endpoint returns all manager records that have completed signup and are marked with `user_type: "signup"`. It is used by admin interfaces that need to display fully signed-up managers separately from pre-signup users.

Implementation: [app/api/managers/signup/route.js](app/api/managers/signup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/managers/signup`
- Auth: public-facing route, intended for admin/internal use
- Response: JSON

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Manager"`
  - `user_type: "signup"`
- Returns the matching managers as `{ managers }`.

## Example Response

```json
{
  "managers": [
    {
      "_id": "64123abc...",
      "name": "Jane Manager",
      "email": "jane.manager@example.com",
      "telephone": "07123456789",
      "account_type": "Manager",
      "user_type": "signup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route reuses the `Users` model from `@/lib/models/Users`.
- It does not include pagination, filtering, sorting, or access control.
- For production use, consider adding authorization, query limits, and error handling.

*Document generated from the `app/api/managers/signup/route.js` implementation.*