# GET /api/leagues/age-groups

## Purpose

Retrieve age group details for a specific league.

## File Location

`app/api/leagues/age-groups/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Reads the required `league` query parameter.
- Finds the league by ID and populates its `age_groups` field.
- Returns the selected league document with `age_groups`.

## Query Parameters

- `league` (required): league ID to retrieve age group details for.

## Request Body

- None

## Response Example

```json
{
  "leagues": {
    "_id": "...",
    "age_groups": [
      { "_id": "...", "age_group": "U12" },
      { "_id": "...", "age_group": "U14" }
    ]
  }
}
```

## Implementation Notes

- The handler calls `Leagues.findById(...)` and populates `age_groups`.
- It does not perform authentication.
- If the query parameter is missing or invalid, the response may be empty or an error from Mongoose.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Leagues from '@/lib/models/Leagues';`
- `import AgeGroups from '@/lib/models/AgeGroups';`

## Notes

- This route returns a league-centric `age_groups` payload rather than a flat age group list.
