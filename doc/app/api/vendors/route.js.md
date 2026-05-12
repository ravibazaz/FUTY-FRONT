# GET /api/vendors

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/vendors/route.js`

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
  "adverts": [ ... ]
}
```

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Vendors from '@/lib/models/Vendors';`

## Notes
