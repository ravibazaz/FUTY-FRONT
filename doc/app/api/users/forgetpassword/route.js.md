
# POST /api/users/forgetpassword

## Purpose

Sends a one-time password (OTP) to the user's email and updates the stored password to the OTP.

## File Location

`app/api/users/forgetpassword/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates the provided email.
- Finds the user by email.
- Generates a numeric OTP.
- Sends the OTP via the Brevo email API.
- Updates the user's password to the OTP value.

## Request Body

```json
{
  "email": "user@example.com"
}
```

## Response

```json
{
  "success": true,
  "data": { "OTP": 12345, "Email": "user@example.com" },
  "message": "We have sent a One Time Password(OTP) to your mail. Do not share this password to anyone"
}
```

## Notes

- The endpoint resets the user password to the OTP.
