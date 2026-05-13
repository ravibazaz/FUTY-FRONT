
# POST /api/users/signupnext

## Purpose

Updates the authenticated user profile and optionally uploads a base64 profile image.

## File Location

`app/api/users/signupnext/route.js`

## HTTP Method

POST

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the user.
- Validates `name`, `telephone`, and optional `profile_image`.
- Converts `post_code` to latitude/longitude via `getLatLng()`.
- Saves a base64 profile image to the appropriate uploads folder.
- Updates the user document with profile, location, and performance fields.

## Request Body

```json
{
  "name": "John",
  "surname": "Doe",
  "telephone": "1234567",
  "profile_image": "data:image/png;base64,...",
  "profile_description": "...",
  "playing_style": "...",
  "team_id": "string",
  "nick_name": "...",
  "post_code": "...",
  "referee_lavel": "...",
  "travel_distance": "..."
}
```

## Response

```json
{
  "success": true,
  "message": "Profile updated successfully!"
}
```

## Notes

- The user's previous profile image is deleted if replaced.
- The endpoint updates location coordinates and GeoJSON data.
