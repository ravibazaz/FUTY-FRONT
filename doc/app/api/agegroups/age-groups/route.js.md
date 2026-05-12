# GET /api/agegroups/age-groups

## Purpose

Returns a specific age group name by ID.

## File Location

`app/api/agegroups/age-groups/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Parses query parameters from the request URL.
- Looks up a specific document by its ID.

## Query Parameters

- `q`

## Request Body

- None

## Response Example

```json
{
  "agegroupname": { ... }
}
```

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Clubs from '@/lib/models/Clubs';`
- `import AgeGroups from '@/lib/models/AgeGroups';`

## Notes

- Returns only the `age_group` field for the requested ID.