
# GET /api/users/deleteaccount

## Purpose

Soft-deactivates the authenticated user's account.

## File Location

`app/api/users/deleteaccount/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the user.
- Sets `isActive` to false for the authenticated user.
- Returns a deletion confirmation.

## Response

```json
{
  "success": false,
  "message": "Your account is deleted"
}
```

## Notes

- The response uses `success: false` even though the operation succeeds.
