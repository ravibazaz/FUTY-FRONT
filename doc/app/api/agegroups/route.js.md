# GET /api/agegroups

## Purpose

Returns all age groups.

## File Location

`app/api/agegroups/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads age group data from the `AgeGroups` collection.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "agegroups": [ ... ]
}
```

## Imports

- `import { connectDB } from '@/lib/db';`
- `import AgeGroups from '@/lib/models/AgeGroups';`

## Notes
