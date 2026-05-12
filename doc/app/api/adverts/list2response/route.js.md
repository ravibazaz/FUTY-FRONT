# GET /api/adverts/list2response

## Purpose

Returns a random selection of currently active adverts for Manager and Friendly pages.

## File

`app/api/adverts/list2response/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Uses aggregation to match adverts where `pages` includes `Manager` or `Friendly`.
- Filters adverts by current date between `startAt` and `endAt`.
- Samples 2 random adverts.
- Projects a limited set of fields.
- Returns success message and data array.

## Request

- No request body.
- Optional query parameters:
  - `q`

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Advertisement  List!",
  "data": [ /* random manager/friendly adverts */ ]
}
```

## Implementation Notes

- `import { NextResponse } from "next/server";`
- `import { connectDB } from '@/lib/db';`
- `import Adverts from "@/lib/models/Adverts";`

## Notes

- Designed to provide a small random selection of active Manager/Friendly adverts.