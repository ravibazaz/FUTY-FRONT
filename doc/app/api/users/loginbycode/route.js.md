
# POST /api/users/loginbycode

## Purpose

Logs in a user using a one-time login code and returns a JWT.

## File Location

`app/api/users/loginbycode/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates `login_code`.
- Finds the matching user by login code.
- Marks the user as verified and active.
- Returns a JWT token and populated user profile.

## Request Body

```json
{
  "login_code": "12345"
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

- Marks the account active when login by code succeeds.
