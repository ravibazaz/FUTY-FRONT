# GET /api/adverts/list2response

## Purpose

Returns a random selection of adverts for Manager or Friendly pages.

## File Location

`app/api/adverts/list2response/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Uses MongoDB aggregation for advanced filtering.

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
  "data": ...
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { connectDB } from '@/lib/db';`
- `import Adverts from "@/lib/models/Adverts";`

## Notes
