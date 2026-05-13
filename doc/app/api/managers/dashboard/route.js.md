# GET /api/managers/dashboard

## Purpose

Provide authenticated manager dashboard data, including activity metrics and curated records.

## File Location

`app/api/managers/dashboard/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the authenticated user with `protectApiRoute(req)`.
- Connects to MongoDB via `connectDB()`.
- Computes `todayStart`, current week range, and a random advert.
- Loads manager-related resources such as team, club, and league.
- Retrieves recent friendlies created by others and by the current manager.
- Builds prioritized friendly recommendations from the manager's league and other leagues.
- Calculates weekly activity counts for posted and accepted friendlies.
- Returns a single dashboard payload with multiple curated sections.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Manager Dashboard!",
  "data": {
    "random_advert": { "name": "...", "image": "...", "link": "..." },
    "my_team": { "name": "...", "image": "..." },
    "my_club": { "name": "...", "image": "..." },
    "my_league": { "title": "...", "image": "...", "age_groups": [ ... ] },
    "random_team": { "name": "...", "ground": { ... }, "club": { ... } },
    "show_next_applicable_friendly_created_by_others_recent_date_limit_one": { ... },
    "the_managers_next_upcomng_schedule_friendly_recent_date_limit_one": { ... },
    "league_friendly_by_priority1": { ... },
    "league_friendly_by_priority2": { ... },
    "random_friendly": { ... },
    "activity": {
      "friendlies_posted_in_this_week": 12,
      "friendlies_accepted_in_this_week": 8
    }
  }
}
```

## Implementation Notes

- The endpoint uses extensive population and aggregation across `Teams`, `Clubs`, `Leagues`, `Friendlies`, and `Grounds`.
- It selects a random advert and a random team matched by the manager's league age groups.
- It builds fallback friendlies when league-specific matches are unavailable.
- Weekly activity is derived from `Friendlies` counts within the current ISO week range.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Users from '@/lib/models/Users';`
- `import Adverts from "@/lib/models/Adverts";`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Grounds from "@/lib/models/Grounds";`
- `import AgeGroups from "@/lib/models/AgeGroups";`

## Notes

- This route is protected and intended for authenticated manager dashboards.
- It returns a rich payload used for UI recommendations and activity metrics.