# GET /api/players/dashboard

## Purpose

Retrieves personalized dashboard data for an authenticated player, including their profile information, a random advertisement, and prioritized friendly match suggestions.

## File Location

`app/api/players/dashboard/route.js`

## HTTP Method

GET

## Authentication Required

Yes - Requires valid authentication via `protectApiRoute(req)`.

## Behavior

- Validates user authentication and returns error if unauthorized.
- Fetches authenticated user's profile with populated manager, team, club, league, age group, and ground data.
- Retrieves a random advertisement from the database.
- Finds prioritized friendly matches using complex logic:
  1. First priority: Friendlies created by the user in their league (today onwards)
  2. Second priority: Friendlies created by others in their league (today onwards)
  3. Third priority: Random friendly from a different league (today onwards)
- Returns comprehensive dashboard data including player details, advert, and friendly suggestions.

## Query Parameters

None

## Request Body

None

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "player": {
      "_id": "string",
      "profile_image": "string",
      "name": "string",
      "surname": "string",
      "palyer_manger_id": {
        "_id": "string",
        "name": "string",
        "team_id": {
          "_id": "string",
          "label": "string",
          "name": "string",
          "image": "string",
          "club": {
            "_id": "string",
            "label": "string",
            "name": "string",
            "image": "string",
            "league": {
              "_id": "string",
              "label": "string",
              "title": "string",
              "image": "string"
            }
          },
          "age_groups": {
            "_id": "string",
            "label": "string",
            "age_group": "string"
          },
          "ground": {
            "_id": "string",
            "label": "string",
            "name": "string",
            "images": ["string"]
          }
        }
      }
    },
    "random_advert": {
      "_id": "string",
      "name": "string",
      "image": "string",
      "link": "string",
      "content": "string"
    },
    "league_friendly_by_priority1": {
      "_id": "string",
      "date": "2024-01-15T10:00:00.000Z",
      "team_id": { /* populated team data */ },
      "manager_id": { /* populated manager data */ },
      "ground_id": { /* populated ground data */ },
      "league_id": { /* populated league data */ },
      "created_by_user": { /* populated creator data */ },
      "accepted_by_user": { /* populated acceptor data */ }
      // ... other friendly fields
    },
    "league_friendly_by_priority2": { /* similar structure */ }
  }
}
```

### Error Responses

- **401 Unauthorized**: Invalid or missing authentication
- **500 Internal Server Error**: Database connection or query failure

## Implementation Details

- Uses MongoDB aggregation pipeline with `$sample` to select random advertisement.
- Implements three-tier priority system for friendly match suggestions:
  - Priority 1: User's own friendlies in their league
  - Priority 2: Other users' friendlies in their league
  - Priority 3: Random friendly from different league using `distinct()` and random selection
- Extensive population of related data across multiple levels (team → club → league, etc.).
- Filters friendlies to only include future dates (today onwards).
- Uses `.lean()` for performance optimization.

## Security Notes

- Protected endpoint requiring authentication.
- Returns sensitive user and organizational data.
- No rate limiting implemented for advertisement randomization.

## Usage Notes

- Designed for player dashboard/home screen displaying personalized content.
- Friendly prioritization ensures relevant matches are shown first.
- Random advertisement provides monetization opportunity.
- Complex population queries may impact performance with large datasets.