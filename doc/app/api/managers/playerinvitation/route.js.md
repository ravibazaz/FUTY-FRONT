# POST /api/managers/playerinvitation

## Purpose

Send a player invitation email and persist the invitation record.

## File Location

`app/api/managers/playerinvitation/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the authenticated manager with `protectApiRoute(req)`.
- Reads JSON request body and validates `player_email` using Zod.
- Generates a unique invitation code using the current timestamp.
- Sends an email through Brevo using the manager name and invitation code.
- Stores the invitation in `PlayerInvitations` with `manager_id` and the generated code.
- Returns the invitation code and a success message.

## Request Body

- JSON object containing:
  - `player_name` (optional)
  - `player_email` (required, valid email)

## Response Example

Success:

```json
{
  "success": true,
  "data": {
    "invitation Code": "1700000000000"
  },
  "message": "Invitation mail has been sent successfully"
}
```

Validation failure:

```json
{
  "success": false,
  "message": {
    "player_email": "Invalid email format"
  }
}
```

## Implementation Notes

- The route sends email via the Brevo REST API.
- It uses HTTP 200 for validation failures and HTTP 500 for email errors.
- The response property name is `invitation Code` with a space.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import { z } from "zod";`
- `import PlayerInvitations from "@/lib/models/PlayerInvitations";`

## Notes

- This endpoint is protected and requires authentication.
- Email delivery depends on valid Brevo environment configuration.