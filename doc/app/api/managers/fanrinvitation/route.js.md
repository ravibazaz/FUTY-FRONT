# POST /api/managers/fanrinvitation

## Purpose

Send a fan invitation email and save the invitation record.

## File Location

`app/api/managers/fanrinvitation/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Protects the route using `protectApiRoute(req)`.
- Reads JSON request body and validates `fan_email` using Zod.
- Generates a unique invitation code based on the current timestamp.
- Sends an email via Brevo containing the invitation code.
- Persists the invitation in `FanInvitations` with `manager_id`.
- Returns the generated invitation code and a success message.

## Request Body

- JSON object containing:
  - `fan_name` (optional)
  - `fan_email` (required, valid email)

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
    "fan_email": "Invalid email format"
  }
}
```

## Implementation Notes

- Uses Brevo email delivery and requires valid environment variables.
- Stores the invitation as `fan_invitation_code` on the saved record.
- Returns HTTP 200 for validation errors and HTTP 500 for delivery failures.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import { z } from "zod";`
- `import FanInvitations from "@/lib/models/FanInvitations";`

## Notes

- This route is protected and requires authentication.
- Actual email sending depends on configured Brevo credentials.