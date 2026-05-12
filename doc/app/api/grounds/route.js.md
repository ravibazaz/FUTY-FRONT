# GET /api/grounds

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/grounds/route.js`

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
- `import Grounds from '@/lib/models/Grounds';`

## Notes
