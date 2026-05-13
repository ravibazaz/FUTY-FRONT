
# POST /api/users/resendcode

## Purpose

Resends a login code to the user email and deactivates the account until verification.

## File Location

`app/api/users/resendcode/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates the provided email.
- Finds the user and generates a numeric login code.
- Sends the code via the Brevo email API.
- Updates the user record with the code and sets `isVerified` and `isActive` to false.

## Request Body

```json
{
  "email": "user@example.com"
}
```

## Response
n
```json
{
  "success": true,
  "message": "Sent login code successfully"
}
```

## Notes

- The endpoint is used for re-sending verification/login codes.
