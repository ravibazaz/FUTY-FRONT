# GET /api/adverts/list

## Purpose

Returns advert documents matching optional search terms.

## File

`app/api/adverts/list/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Reads optional query parameter `q` from the URL.
- Filters adverts by `name` using case-insensitive regex if `q` is provided.
- Selects only the advertised fields: `name`, `image`, `content`, `link`, `date`, `time`, `end_date`, `end_time`, `pages`.
- Returns success message and data array.

## Request

- No request body.
- Optional query parameters:
  - `q`

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Adverts List!",
  "data": [ /* adverts */ ]
}
```

## Implementation Notes

- `import { NextResponse } from "next/server";`
- `import { connectDB } from '@/lib/db';`
- `import Adverts from "@/lib/models/Adverts";`

## Notes

- This endpoint returns advert details suitable for list views.