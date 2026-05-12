# GET /api/adverts

## Purpose

Returns active adverts for the FUTY application.

## File

`app/api/adverts/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries `Adverts` collection for `isActive: true`.
- Returns JSON with the matching adverts.

## Request

- No request body.

## Response Example

```json
{
  "adverts": [ /* active adverts */ ]
}
```

## Implementation Notes

- `import { connectDB } from '@/lib/db';`
- `import Adverts from '@/lib/models/Adverts';`

## Notes

- This is the public adverts endpoint for active adverts.
- It is used by the admin adverts listing and public advert consumption.