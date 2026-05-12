# GET /api/groundfacilities

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/groundfacilities/route.js`

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
- `import GroundFacilities from '@/lib/models/GroundFacilities';`

## Notes
