
# GET /api/teams/list

## Purpose

Retrieves teams with optional search, pagination, and an active-filter mode for unused teams.

## File Location

`app/api/teams/list/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Parses `q`, `page`, `active`, and `limit`.
- If `active` is truthy, returns only teams whose club is not in use by existing user teams.
- Otherwise returns paginated teams with populated club/league data.
- Provides pagination metadata.

## Query Parameters

- `q` (optional)
- `page` (optional, default `1`)
- `limit` (optional, default `1000`)
- `active` (optional)

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Teams List!",
  "data": [ /* team objects */ ],
  "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5, "hasNextPage": true, "hasPrevPage": false }
}
```

## Notes

- Protected endpoint.
