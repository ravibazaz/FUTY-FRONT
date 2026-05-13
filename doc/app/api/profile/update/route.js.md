# POST /api/profile/update

## Purpose

Updates the authenticated user's profile information and optionally stores a new profile image.

## File Location

`app/api/profile/update/route.js`

## HTTP Method

POST

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Verifies the authenticated user using `protectApiRoute(req)`.
- Reads the JSON request body.
- Validates input fields using the `UserSchema` Zod schema.
- Checks for an existing user with the same email address and refuses duplicates.
- Updates profile fields: `name`, `email`, `telephone`, `surname`, and `nick_name`.
- If `profile_image` is provided as Base64, saves it to disk under an uploads directory based on account type.
- Deletes the previous profile image file if one exists.
- Saves the updated user document.

## Request Body

```json
{
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "telephone": "+1234567890",
  "nick_name": "JD",
  "profile_image": "data:image/png;base64,iVBORw0..."
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
    "email": "Invalid email format",
    "name": "Name is required"
  }
}
```

### Error Responses

- **401 Unauthorized**: Missing or invalid authentication.
- **200 OK with validation errors**: Invalid request data.
- **409 Conflict / 200 with duplicate error**: Email already exists on another account.
- **500 Internal Server Error**: File system or database failure.

## Implementation Details

- Uses Zod validation for `email`, `name`, `telephone`, and optional `profile_image`.
- If `profile_image` is a valid Base64 image string, extracts MIME type, creates an uploads path, and writes the file to disk.
- Saves the file under one of:
  - `uploads/managers`
  - `uploads/fans`
  - `uploads/referees`
- Deletes the old profile image file when a new one is uploaded.
- Does not update password here, even though bcrypt is imported and commented out.
- Uses `findByIdAndUpdate()` for the authenticated user's record.

## Security Notes

- Protected endpoint allowing profile changes for the current authenticated account only.
- Accepts Base64 image uploads; validate file size and content on the client or in future backend hardening.
- Email uniqueness check excludes the current user.

## Usage Notes

- Use this endpoint from profile update forms.
- The client must provide all required fields and can optionally submit a Base64 `profile_image`.
- This route updates profile metadata, not the password.