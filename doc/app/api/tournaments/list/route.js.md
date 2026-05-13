
# GET /api/tournaments/list

## Purpose

Retrieves tournaments with search, pagination, optional radius filtering, distance calculation, and user-specific population.

## File Location

`app/api/tournaments/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Supports query filters:
  - `q` for name search
  - `page` for pagination
  - `limit` for page size
  - `radius` in kilometers to filter by distance from the authenticated user's team ground
- Populates related `ground`, `club.age_groups`, `created_by_user.team_id.club.league`, and matching `tournamentorderhistories` for the user.
- Calculates distance from the manager's team ground to each tournament ground.
- Sorts by distance then date and paginates the results.

## Query Parameters

- `q` (optional)
- `page` (optional, default `1`)
- `limit` (optional, default `10`)
- `radius` (optional, kilometers)

## Response

```json
{
  "success": true,
  "message": "Welcome to the Tournament List!",
  "data": [/* paginated tournament objects */],
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

## Notes

- Distance is computed only when both the user and ground coordinates are available.
- The route uses server-side pagination after sorting.
