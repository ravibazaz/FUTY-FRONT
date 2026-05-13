# GET /api/clubs/age-groups

## Purpose
Returns the age groups associated with a specific club.
This endpoint is used to retrieve a club's configured age brackets and related metadata.

## File Location
`app/api/clubs/age-groups/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB using `connectDB()`.
- Extracts `clubid` from the request query string.
- Queries the `Clubs` collection by club ID.
- Selects only `name` and `age_groups` fields.
- Populates the `age_groups` reference so returned data includes full age group documents.
- Returns the club with its populated age groups.

## Query Parameters
- `clubid` (required) — the ID of the club to fetch age groups for

## Request Body
- None

## Response Example
```json
{
  "clubs": {
    "_id": "6432f88f1e197c1d8a1b4d2f",
    "name": "City United",
    "age_groups": [
      {
        "_id": "6432f88f1e197c1d8a1b4d3a",
        "age_group": "U12"
      },
      {
        "_id": "6432f88f1e197c1d8a1b4d3b",
        "age_group": "U14"
      }
    ]
  }
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Clubs` model from `@/lib/models/Clubs`
  - `AgeGroups` model from `@/lib/models/AgeGroups`
- Handler steps:
  1. Call `await connectDB()`.
  2. Parse `clubid` from `new URL(req.url).searchParams`.
  3. Execute `Clubs.findById(clubid).select("name age_groups").populate("age_groups").lean()`.
  4. Return `Response.json({ clubs })`.

## Notes
- Returns only club name and populated age group data.
- If `clubid` is missing or invalid, the response may contain `clubs: null`.
- This endpoint is public and does not require authentication.
