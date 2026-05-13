
# POST /api/users/signup

## Purpose

Registers a new user and sends a login code by email.

## File Location

`app/api/users/signup/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates the request body with Zod.
- Supports invitation codes for Player, Fan, and Manager account types.
- Ensures the email does not already exist.
- Creates a new user with a hashed password.
- Sends a login code using the Brevo email API.
- Stores the login code on the user record.

## Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "name": "John",
  "telephone": "1234567890",
  "account_type": "Player",
  "invitation_code": "OPTIONAL",
  "fcmtoken": "OPTIONAL"
}
```

## Response

```json
{
  "success": true,
  "data": { "Login Code": 12345, "isVerified": false },
  "message": "User created successfully. Please check login code in email."
}
```

## Notes

- The endpoint returns validation errors in a `success: false` response.
- Invitation code checks vary by account type.
