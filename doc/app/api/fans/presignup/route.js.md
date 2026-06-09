**Title:** Fans Presignup API (GET /api/fans/presignup)

## Overview

This endpoint returns all pre-signup fan records. It is used by the admin interface to display fans who have registered but remain in the `presignup` state.

Implementation: [app/api/fans/presignup/route.js](app/api/fans/presignup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/fans/presignup`
- Auth: public-facing route, but intended for internal/admin usage
- Response: JSON

## Behavior

- Connects to MongoDB with `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Fan"`
  - `user_type: "presignup"`
- Returns the matching fan records as `{ fans }`.

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
      "user_type": "presignup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route uses the shared `Users` model from `@/lib/models/Users`.
- It does not implement pagination, filtering, or sorting.
- It does not apply authentication or authorization checks.
- For production use, consider adding access control and query limits.

*Document generated from the `app/api/fans/presignup/route.js` implementation.*