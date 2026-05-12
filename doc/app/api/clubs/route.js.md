# GET /api/clubs

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/clubs/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": ...
}
```

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Clubs from '@/lib/models/Clubs';`
- `import Grounds from '@/lib/models/Grounds';`

## Notes
