# GET /api/leagues

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/leagues/route.js`

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
- `import Leagues from '@/lib/models/Leagues';`

## Notes
