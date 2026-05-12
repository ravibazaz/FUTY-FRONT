# GET /api/adverts/list

## Purpose

Returns adverts matching optional search criteria.

## File Location

`app/api/adverts/list/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Reads advert data from the `Adverts` collection.

## Query Parameters

- `q`
- `page`

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "pagination": { ... }
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { connectDB } from '@/lib/db';`
- `import Adverts from "@/lib/models/Adverts";`

## Notes

- Supports pagination and optional search filters.