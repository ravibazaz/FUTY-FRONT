
# GET /api/teams/check-club-age

## Purpose

Checks whether a team exists for a club and age group, optionally excluding one team ID.

## File Location

`app/api/teams/check-club-age/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Reads `club`, `age_groups`, and optional `id` from query parameters.
- Returns `{ exists: true }` if a matching team exists.
- If `id` is provided, excludes that team from the match.

## Query Parameters

- `club` (required)
- `age_groups` (required)
- `id` (optional)

## Request Body

None

## Response

```json
{ "exists": true }
```

## Notes

- Public validation endpoint.
