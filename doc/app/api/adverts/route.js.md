# GET /api/adverts

## Purpose

Returns active adverts for public or admin consumption.

## File Location

`app/api/adverts/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads advert data from the `Adverts` collection.

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
- `import Adverts from '@/lib/models/Adverts';`

## Notes
