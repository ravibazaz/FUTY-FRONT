# GET /api/managers/list

## Purpose

Return a protected, paginated list of managers with optional name search.

## File Location

`app/api/managers/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Validates the current user via `protectApiRoute(req)`.
- Connects to MongoDB using `connectDB()`.
- Reads optional query parameters `q`, `page`, and `limit`.
- Filters managers by `account_type: "Manager"` and optionally by `name` using a case-insensitive regex.
- Populates each manager's `team_id` and nested club/league details.
- Returns paginated manager records.

## Query Parameters

- `q` (optional): search string for manager name.
- `page` (optional): page number, defaults to `1`.
- `limit` (optional): items per page, defaults to `10`.

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "Welcome to the Manager List!",
  "data": [
    {
      "_id": "...",
      "profile_image": "...",
      "name": "Jane",
      "surname": "Doe",
      "team_id": {
        "name": "A Team",
        "club": {
          "label": "AC",
          "name": "A Club",
          "league": { "label": "PL", "title": "Premier League" }
        }
      }
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Implementation Notes

- The route is fully protected and returns auth errors for unauthenticated requests.
- It uses nested `populate` calls to include `team_id.club` and `club.league` data.
- Pagination defaults to `page=1` and `limit=10`.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Users from '@/lib/models/Users';`
- `import Teams from "@/lib/models/Teams";`
- `import Clubs from "@/lib/models/Clubs";`
- `import Leagues from "@/lib/models/Leagues";`

## Notes

- Search applies only to the manager `name` field.
- The response includes both record data and pagination metadata.