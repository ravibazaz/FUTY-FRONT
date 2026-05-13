# POST /api/profile/change-password

## Purpose

Updates the authenticated user's password after validating password fields.

## File Location

`app/api/profile/change-password/route.js`

## HTTP Method

POST

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Verifies the authenticated user using `protectApiRoute(req)`.
- Reads the JSON request body.
- Validates password fields using the `UserSchema` Zod schema.
- Ensures both `password` and `confirm_password` are at least 7 characters when provided and that they match.
- Hashes the new password with `bcrypt` and updates the authenticated user's document.
- Returns success or validation error details.

## Request Body

```json
{
  "password": "newPassword123",
  "confirm_password": "newPassword123"
}
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "Profile updated successfully!"
}
```

### Validation Failure Example (200)

```json
{
  "success": false,
  "message": {
    "confirm_password": "Passwords don't match"
  }
}
```

### Error Responses

- **401 Unauthorized**: Missing or invalid authentication.
- **200 OK with validation errors**: Invalid or mismatched password fields.
- **500 Internal Server Error**: Database or hashing failure.

## Implementation Details

- Accepts optional `password` and `confirm_password` fields but requires matching values when provided.
- Uses `bcrypt.hash()` with salt rounds 10 to hash the new password.
- Updates the user document by `_id`.
- Returns the same status code 200 for both successful updates and validation failures.

## Security Notes

- Protected endpoint storing hashed passwords only.
- Does not support old password verification; it updates the password directly for authenticated users.
- No rate limiting or brute-force protection is implemented in this route.

## Usage Notes

- Use when authenticated users need to change their password.
- Ensure the client sends both `password` and `confirm_password` fields.
- The endpoint will not update the password if validation fails.