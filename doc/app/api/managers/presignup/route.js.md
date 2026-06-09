**Title:** Managers Presignup API (GET /api/managers/presignup)

## Overview

This endpoint returns all manager records that are in the pre-signup state. It is used by admin pages to list managers who have registered but have not yet been fully activated or converted to `signup` users.

Implementation: [app/api/managers/presignup/route.js](app/api/managers/presignup/route.js#L1-L20)

## Endpoint

- Method: GET
- Path: `/api/managers/presignup`
- Auth: public-facing route, intended for admin/internal use
- Response: JSON

## Behavior

- Connects to MongoDB with `connectDB()`.
- Queries the `Users` collection for documents matching:
  - `account_type: "Manager"`
  - `user_type: "presignup"`
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
      "user_type": "presignup",
      "profile_image": "/uploads/players/example.jpg",
      ...
    }
  ]
}
```

## Notes

- The route reuses the `Users` model from `@/lib/models/Users`.
- It does not include pagination, filtering, or sorting.
- It does not enforce access control or authentication.
- For production use, consider adding authorization, query limits, and error handling.

*Document generated from the `app/api/managers/presignup/route.js` implementation.*