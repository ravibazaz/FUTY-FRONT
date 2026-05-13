# GET /api/check-email

## Purpose
Checks whether an email address is already registered in the system.
This endpoint is used for email validation during user registration and profile updates.

## File Location
`app/api/check-email/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Extracts `email` and optional `id` from query string parameters.
- Returns `exists: false` if no email is provided.
- Builds a query to check for existing users with the email:
  - If `id` is provided, excludes that user ID from the check (useful for profile updates).
  - If no `id` is provided, checks for any user with the email.
- Returns a boolean indicating whether the email exists in the system.

## Query Parameters
- `email` (required) — the email address to check for availability
- `id` (optional) — user ID to exclude from the check (for profile updates)

## Request Body
- None

## Response Example
```json
{
  "exists": true
}
```

Or if email is available:
```json
{
  "exists": false
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `User` model from `@/lib/models/Users`
  - `connectDB` from `@/lib/db`
- Handler steps:
  1. Call `await connectDB()`.
  2. Parse `email` and `id` from `new URL(req.url).searchParams`.
  3. Return `exists: false` if no email provided.
  4. Build query with optional ID exclusion.
  5. Execute `User.findOne(query)`.
  6. Return `NextResponse.json({ exists: !!existing })`.

## Response Field
- `exists` (boolean) — `true` if email is already registered, `false` if available

## Use Cases
- **User Registration**: Check if email is available before creating new account.
- **Profile Updates**: Verify email availability when user changes their email address.
- **Form Validation**: Real-time email availability checking in registration forms.

## Security
- This endpoint does not require authentication; email availability is public information.
- No sensitive user data is exposed; only boolean existence is returned.

## Notes
- The optional `id` parameter allows checking email availability while excluding the current user's existing email.
- Useful for scenarios where a user wants to change their email but keep the same address.
- Returns `false` for non-existent emails and when no email parameter is provided.
