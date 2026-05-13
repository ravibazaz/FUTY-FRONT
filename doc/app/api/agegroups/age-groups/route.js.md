# GET /api/agegroups/age-groups

## Purpose
Returns the name of a single age group by its ID.
This endpoint is used when the client needs to resolve an age group identifier into the displayable `age_group` label.

## File Location
`app/api/agegroups/age-groups/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Extracts `agegroupId` from the query string of the request URL.
- Queries the `AgeGroups` collection by `_id`.
- Selects only the `age_group` field.
- Returns the found document under `agegroupname`.

## Query Parameters
- `agegroupId` (required) — the ID of the age group to retrieve

## Request Body
- None

## Response Example
```json
{
  "agegroupname": {
    "_id": "6432f88f1e197c1d8a1b4d2f",
    "age_group": "U12"
  }
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Clubs` model from `@/lib/models/Clubs` (unused in this handler)
  - `AgeGroups` model from `@/lib/models/AgeGroups`
- Handler steps:
  1. Call `await connectDB()`.
  2. Parse `agegroupId` from `new URL(req.url).searchParams`.
  3. Execute `AgeGroups.findById(agegroupId).select('age_group').lean()`.
  4. Return `Response.json({ agegroupname })`.

## Notes
- The `Clubs` import is present in source code but not used in this endpoint.
- This endpoint returns only the `age_group` field, not the full age group record.
- If `agegroupId` is missing or invalid, the response may contain `null` under `agegroupname`.