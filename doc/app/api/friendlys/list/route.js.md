# GET /api/friendlys/list

## Purpose

Provide an authenticated user with categorized friendly match listings for dashboard display.

## File Location

`app/api/friendlys/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Uses `protectApiRoute(req)` to require a valid authenticated user.
- Calls `connectDB()` before querying the database.
- Builds multiple friendly collections based on the requesting user and match state.
- Populates related references for teams, managers, grounds, leagues, clubs, and users.
- Returns a single response object with several grouped friendly lists.

## Query Parameters

- None

## Request Body

- None

## Data Groups Returned

- `all_friendlies_created_others`
  - Friendlies from other users with `accepted_by_user: null` and upcoming `date >= today`.
- `all_friendlies_created_me_not_accepted`
  - Current user friendlies where either the match is in the future or the friendly has been accepted.
- `all_friendlies_created_me_accepted_by_others`
  - Current user friendlies that have been accepted by another user and are in the future.
- `todays_friendlies_created_me`
  - Current user friendlies scheduled for today.
- `upcomings_friendlies_created_me_and_others`
  - Future friendlies where the current user is either the creator or the acceptor.
- `archive_friendlies_created_me`
  - Past friendlies created by the current user.

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the friendlies List!",
  "data": {
    "all_friendlies_created_others": [ ... ],
    "all_friendlies_created_me_not_accepted": [ ... ],
    "all_friendlies_created_me_accepted_by_others": [ ... ],
    "todays_friendlies_created_me": [ ... ],
    "upcomings_friendlies_created_me_and_others": [ ... ],
    "archive_friendlies_created_me": [ ... ]
  }
}
```

## Implementation Notes

- The endpoint calculates `todayStart`, `todayEnd`, and `tomorrowStart` in local server time.
- It populates nested document references for better dashboard rendering.
- There is an unused `getDistance` call and a large commented aggregation block in the source.
- The endpoint returns the same dataset structure even when no matches are found.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Friendlies from "@/lib/models/Friendlies";`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`
- `import Grounds from "@/lib/models/Grounds";`
- `import { getDistance } from "@/lib/geocode";`

## Notes

- This route requires authentication and returns data scoped for the current user.
- It is intended for dashboard/list views, not for unauthenticated public listing.
- Supports pagination and optional search filters.