# GET /api/logout

## Purpose

Clear authentication cookies and log the user out.

## File Location

`app/api/logout/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Returns a JSON success response.
- Clears the `auth_token` and `user_id` cookies by setting them with `maxAge: 0`.
- Uses `NextResponse.json(...)` to build the response.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true
}
```

## Imports

- `import { NextResponse } from "next/server";`

## Notes

- This route performs logout by invalidating cookies.
- No database access or authentication middleware is executed in the handler.
