# GET /api/check-auth

## Purpose
Checks whether the current user is authenticated in the application.
This endpoint is used by the client-side application to verify session status on page load or for conditional redirects.

## File Location
`app/api/check-auth/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Invokes the `isAuthenticated()` helper function from the auth library.
- Returns a boolean indicating whether the user has a valid, active session.
- No database queries or external API calls in the handler itself.
- Response is based on session/cookie validation from the auth utility.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "isAuthenticated": true
}
```

Or if not authenticated:
```json
{
  "isAuthenticated": false
}
```

## Implementation Details
- Imports:
  - `isAuthenticated` from `@/lib/auth`
  - `NextResponse` from `next/server`
- Handler steps:
  1. Call `await isAuthenticated()` to check session status.
  2. Return `NextResponse.json({ isAuthenticated: isAuth })`.

## Response Field
- `isAuthenticated` (boolean) — `true` if user has valid session/authentication, `false` otherwise

## Security
- This endpoint does not require authentication itself; it checks authentication status.
- Safe to call from unauthenticated contexts (e.g., login page, before redirect).

## Use Cases
- Client-side page initialization to determine whether to show login or dashboard.
- Guarding protected routes with automatic redirect if not authenticated.
- Conditional UI rendering based on authentication status.

## Notes
- This is a lightweight endpoint with minimal overhead.
- Uses the application's auth utility which handles cookie/session validation.
- Useful for SPA applications requiring real-time authentication status checks.
