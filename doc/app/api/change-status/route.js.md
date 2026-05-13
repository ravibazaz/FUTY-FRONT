# GET /api/change-status

## Purpose
Updates a user's active status (enables or disables a user account).
This endpoint is used for user account management, deactivation, or reactivation operations.

## File Location
`app/api/change-status/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Extracts `id` and `isActive` from query string parameters.
- Queries the `Users` collection by user ID and updates the `isActive` field.
- Uses `findByIdAndUpdate()` to atomically update the user record.
- Returns the `isActive` status value that was set.

## Query Parameters
- `id` (required) — the ID of the user to update
- `isActive` (required) — the new active status value (typically "true" or "false")

## Request Body
- None

## Response Example
```json
{
  "msg": "true"
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `User` model from `@/lib/models/Users`
  - `connectDB` from `@/lib/db`
- Handler steps:
  1. Call `await connectDB()`.
  2. Parse `id` and `isActive` from `new URL(req.url).searchParams`.
  3. Execute `User.findByIdAndUpdate(id, { isActive: isActive })`.
  4. Return `NextResponse.json({ 'msg': isActive })`.

## Security Notes
- ⚠️ **Warning**: This endpoint has no authentication protection. Any client can change any user's status.
- ⚠️ **Warning**: Uses GET method for a state-changing operation (should typically use PATCH or POST).
- Consider adding `protectApiRoute()` middleware for security.

## Notes
- The response returns only the `isActive` value, not confirmation of the update.
- No validation of the `id` or `isActive` parameters before updating.
- Consider returning success/failure confirmation and the complete updated user object.
