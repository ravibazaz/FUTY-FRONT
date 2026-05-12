# GET /api/uploads/categories/[filename]

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/uploads/categories/[filename]/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Returns structured JSON response to the client.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "categories": [ ... ]
}
```

## Imports

- `import { NextResponse } from 'next/server';`
- `import fs from 'fs';`
- `import path from 'path';`
- `import mime from 'mime-types';`

## Notes

- Serves uploaded files based on filename parameters.