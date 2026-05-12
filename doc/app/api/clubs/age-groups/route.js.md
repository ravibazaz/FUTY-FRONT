# GET /api/clubs/age-groups

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/clubs/age-groups/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Parses query parameters from the request URL.
- Looks up a specific document by its ID.

## Query Parameters

- `q`

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
- `import AgeGroups from '@/lib/models/AgeGroups';`

## Notes
