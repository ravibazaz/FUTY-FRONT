
# POST /api/users/login

## Purpose

Authenticates an existing user with email and password and returns a JWT.

## File Location

`app/api/users/login/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates `email` and `password`.
- Rejects users that are not verified or inactive.
- Loads the user and bcrypt-verifies the password.
- Updates the user FCM token if provided.
- Returns a JWT token and populated user profile.

## Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fcmtoken": "OPTIONAL"
}
```

## Response

```json
{
  "success": true,
  "message": "Login successfully",
  "data": { /* user object */ },
  "token": "jwt-token"
}
```

## Notes

- User data includes related team, club, and league data for fan/player managers.
