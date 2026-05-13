# GET /api/managers/[id]

## Purpose

Retrieve details for a specific manager user by ID.

## File Location

`app/api/managers/[id]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the request with `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Reads the `id` route parameter.
- Queries `Users.findById(id)` and populates the manager's team, club, league, and age groups.
- Returns the manager document in the response.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Manager List!",
  "data": {
    "_id": "...",
    "name": "Jane",
    "surname": "Doe",
    "team_id": {
      "name": "A Team",
      "club": { "label": "AC", "name": "A Club", "image": "...", "league": { "label": "PL", "title": "Premier League" } },
      "age_groups": [ { "_id": "...", "label": "U18", "age_group": "Under 18" } ]
    }
  }
}
```

## Implementation Notes

- The route is protected and will return auth errors for unauthenticated access.
- It populates nested references for `team_id.club` and `team_id.age_groups`.
- The response already strips `__v` from the returned document.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Users from '@/lib/models/Users';`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import AgeGroups from "@/lib/models/AgeGroups";`

## Notes

- This endpoint is designed for authenticated user profile detail retrieval.