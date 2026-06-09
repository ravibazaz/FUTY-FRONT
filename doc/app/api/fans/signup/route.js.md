**Title:** Fans Signup API (GET /api/fans/signup)

## Overview

This endpoint returns all fan records that have completed signup and are marked with `user_type: "signup"`. It is intended for admin interfaces that need to display fully signed-up fans separately from pre-signup users.

Implementation: [app/api/fans/signup/route.js](app/api/fans/signup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/fans/signup`
- Auth: public-facing route, but intended for internal/admin usage
- Response: JSON

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Fan"`
  - `user_type: "signup"`
- Returns the matching fans as `{ fans }`.

## Example Response

```json
{
  "fans": [
    {
      "_id": "64123abc...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "telephone": "07123456789",
      "account_type": "Fan",
      "user_type": "signup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route uses the shared `Users` model from `@/lib/models/Users`.
- It does not implement pagination, filtering, sorting, or access control.
- For production systems, consider adding authentication/authorization and query limits.

*Document generated from the `app/api/fans/signup/route.js` implementation.*